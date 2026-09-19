const Property = require("../models/Property");

// ========================================
// CREATE PROPERTY
// ========================================
const createProperty = async (req, res) => {
  try {
    const {
      title,
      location,
      listingType,
      propertyType,
      price,
      status,
      beds,
      baths,
      area,
      image,
      description,
      features,
    } = req.body;

    if (
      !title ||
      !location ||
      !listingType ||
      !propertyType ||
      price === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, location, listing type, property type and price are required",
      });
    }

    const property = await Property.create({
      title,
      location,
      listingType,
      propertyType,
      price,
      priceLabel: `PKR ${Number(
        price
      ).toLocaleString()}`,
      status: status || "Available",
      beds: beds || 0,
      baths: baths || 0,
      area: area || 0,
      image: image || "",
      description: description || "",
      features: Array.isArray(features)
        ? features
        : [],
      ownerId: req.user._id,
      ownerName: req.user.name,
      ownerEmail: req.user.email,
    });

    res.status(201).json({
      success: true,
      message:
        "Property created successfully",
      property,
    });
  } catch (error) {
    console.error(
      "Create Property Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET ALL PROPERTIES
// ========================================
const getProperties = async (req, res) => {
  try {
    const properties =
      await Property.find()
        .populate(
          "ownerId",
          "name email role"
        )
        .sort({
          createdAt: -1,
        });

    res.status(200).json({
      success: true,
      count: properties.length,
      properties,
    });
  } catch (error) {
    console.error(
      "Get Properties Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// GET SINGLE PROPERTY
// ========================================
const getPropertyById = async (req, res) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      ).populate(
        "ownerId",
        "name email role"
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    res.status(200).json({
      success: true,
      property,
    });
  } catch (error) {
    console.error(
      "Get Property Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// UPDATE PROPERTY
// ========================================
const updateProperty = async (req, res) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    const propertyOwnerId =
      property.ownerId
        ? property.ownerId.toString()
        : null;

    const currentUserId =
      req.user._id
        ? req.user._id.toString()
        : null;

    const isOwner =
      propertyOwnerId &&
      currentUserId &&
      propertyOwnerId === currentUserId;

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to update this property",
      });
    }

    const {
      title,
      location,
      listingType,
      propertyType,
      price,
      status,
      beds,
      baths,
      area,
      image,
      description,
      features,
    } = req.body;

    if (title !== undefined) {
      property.title = title;
    }

    if (location !== undefined) {
      property.location = location;
    }

    if (listingType !== undefined) {
      property.listingType =
        listingType;
    }

    if (propertyType !== undefined) {
      property.propertyType =
        propertyType;
    }

    if (price !== undefined) {
      property.price = price;

      property.priceLabel =
        `PKR ${Number(
          price
        ).toLocaleString()}`;
    }

    if (status !== undefined) {
      property.status = status;
    }

    if (beds !== undefined) {
      property.beds = beds;
    }

    if (baths !== undefined) {
      property.baths = baths;
    }

    if (area !== undefined) {
      property.area = area;
    }

    if (image !== undefined) {
      property.image = image;
    }

    if (description !== undefined) {
      property.description =
        description;
    }

    if (features !== undefined) {
      property.features =
        Array.isArray(features)
          ? features
          : [];
    }

    const updatedProperty =
      await property.save();

    res.status(200).json({
      success: true,
      message:
        "Property updated successfully",
      property: updatedProperty,
    });
  } catch (error) {
    console.error(
      "Update Property Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ========================================
// DELETE PROPERTY
// ========================================
const deleteProperty = async (req, res) => {
  try {
    const property =
      await Property.findById(
        req.params.id
      );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    /*
      Some older properties may not have
      ownerId. Therefore we check safely
      instead of calling .toString()
      directly on undefined.
    */

    const propertyOwnerId =
      property.ownerId
        ? property.ownerId.toString()
        : null;

    const currentUserId =
      req.user._id
        ? req.user._id.toString()
        : null;

    const isOwner =
      propertyOwnerId &&
      currentUserId &&
      propertyOwnerId === currentUserId;

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this property",
      });
    }

    await Property.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Property deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Property Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
};