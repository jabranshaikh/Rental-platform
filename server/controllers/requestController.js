const Request = require("../models/Request");
const Property = require("../models/Property");

// ==============================
// CREATE REQUEST
// ==============================

const createRequest = async (req, res) => {
  try {
    const {
      propertyId,
      requestType,
      preferredDate,
      preferredTime,
      message,
    } = req.body;

    if (!propertyId || !requestType) {
      return res.status(400).json({
        success: false,
        message:
          "Property ID and request type are required",
      });
    }

    if (
      ![
        "Contact Owner",
        "Property Viewing",
      ].includes(requestType)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid request type",
      });
    }

    const property = await Property.findById(
      propertyId
    );

    if (!property) {
      return res.status(404).json({
        success: false,
        message: "Property not found",
      });
    }

    if (
      property.ownerId.toString() ===
      req.user._id.toString()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "You cannot send a request for your own property",
      });
    }

    const existingRequest =
      await Request.findOne({
        propertyId,
        userId: req.user._id,
        status: "Pending",
      });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending request for this property",
      });
    }

    const request = await Request.create({
      propertyId: property._id,
      propertyTitle: property.title,
      propertyLocation: property.location,

      ownerId: property.ownerId,
      ownerName: property.ownerName,
      ownerEmail: property.ownerEmail,

      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,

      requestType,

      preferredDate: preferredDate || "",
      preferredTime: preferredTime || "",

      message: message || "",

      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Request submitted successfully",
      request,
    });
  } catch (error) {
    console.error(
      "Create Request Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET MY REQUESTS
// ==============================

const getMyRequests = async (req, res) => {
  try {
    const requests = await Request.find({
      userId: req.user._id,
    })
      .populate(
        "propertyId",
        "title location price image status"
      )
      .populate(
        "ownerId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get My Requests Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// GET OWNER REQUESTS
// ==============================

const getOwnerRequests = async (
  req,
  res
) => {
  try {
    const requests = await Request.find({
      ownerId: req.user._id,
    })
      .populate(
        "propertyId",
        "title location price image status"
      )
      .populate(
        "userId",
        "name email"
      )
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    console.error(
      "Get Owner Requests Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// APPROVE REQUEST
// ==============================

const approveRequest = async (
  req,
  res
) => {
  try {
    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isOwner =
      request.ownerId.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to approve this request",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending requests can be approved",
      });
    }

    request.status = "Approved";

    await request.save();

    res.status(200).json({
      success: true,
      message:
        "Request approved successfully",
      request,
    });
  } catch (error) {
    console.error(
      "Approve Request Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// REJECT REQUEST
// ==============================

const rejectRequest = async (
  req,
  res
) => {
  try {
    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isOwner =
      request.ownerId.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to reject this request",
      });
    }

    if (request.status !== "Pending") {
      return res.status(400).json({
        success: false,
        message:
          "Only pending requests can be rejected",
      });
    }

    request.status = "Rejected";

    await request.save();

    res.status(200).json({
      success: true,
      message:
        "Request rejected successfully",
      request,
    });
  } catch (error) {
    console.error(
      "Reject Request Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ==============================
// DELETE MY REQUEST
// ==============================

const deleteRequest = async (
  req,
  res
) => {
  try {
    const request =
      await Request.findById(
        req.params.id
      );

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request not found",
      });
    }

    const isOwner =
      request.userId.toString() ===
      req.user._id.toString();

    const isAdmin =
      req.user.role === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to delete this request",
      });
    }

    await Request.findByIdAndDelete(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message:
        "Request deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Request Error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createRequest,
  getMyRequests,
  getOwnerRequests,
  approveRequest,
  rejectRequest,
  deleteRequest,
};