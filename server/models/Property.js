const mongoose = require("mongoose");

const propertySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    listingType: {
      type: String,
      enum: ["Rent", "Sale"],
      required: true,
    },

    propertyType: {
      type: String,
      enum: [
        "House",
        "Apartment",
        "Villa",
        "Studio",
        "Commercial",
      ],
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    priceLabel: {
      type: String,
    },

    status: {
      type: String,
      enum: [
        "Available",
        "Reserved",
        "Sold",
        "Rented",
      ],
      default: "Available",
    },

    beds: {
      type: Number,
      default: 0,
    },

    baths: {
      type: Number,
      default: 0,
    },

    area: {
      type: Number,
      default: 0,
    },

    image: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    features: {
      type: [String],
      default: [],
    },

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    ownerName: {
      type: String,
      default: "",
    },

    ownerEmail: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const Property = mongoose.model(
  "Property",
  propertySchema
);

module.exports = Property;