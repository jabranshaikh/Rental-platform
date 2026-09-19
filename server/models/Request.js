const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },

    propertyTitle: {
      type: String,
      required: true,
    },

    propertyLocation: {
      type: String,
      required: true,
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

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      required: true,
    },

    userEmail: {
      type: String,
      required: true,
    },

    requestType: {
      type: String,
      enum: [
        "Contact Owner",
        "Property Viewing",
      ],
      required: true,
    },

    preferredDate: {
      type: String,
      default: "",
    },

    preferredTime: {
      type: String,
      default: "",
    },

    message: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

const Request = mongoose.model(
  "Request",
  requestSchema
);

module.exports = Request;