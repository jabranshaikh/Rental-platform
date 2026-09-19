const express = require("express");

const {
  createProperty,
  getProperties,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// GET ALL PROPERTIES
// ==============================

router.get(
  "/",
  getProperties
);


// ==============================
// GET SINGLE PROPERTY
// ==============================

router.get(
  "/:id",
  getPropertyById
);


// ==============================
// CREATE PROPERTY
// ==============================

router.post(
  "/",
  protect,
  authorizeRoles(
    "owner",
    "admin"
  ),
  createProperty
);


// ==============================
// UPDATE PROPERTY
// ==============================

router.put(
  "/:id",
  protect,
  authorizeRoles(
    "owner",
    "admin"
  ),
  updateProperty
);


// ==============================
// DELETE PROPERTY
// ==============================

router.delete(
  "/:id",
  protect,
  authorizeRoles(
    "owner",
    "admin"
  ),
  deleteProperty
);


module.exports = router;