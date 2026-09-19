const express = require("express");

const {
  createRequest,
  getMyRequests,
  getOwnerRequests,
  approveRequest,
  rejectRequest,
  deleteRequest,
} = require("../controllers/requestController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// CREATE REQUEST
// ==============================

router.post(
  "/",
  protect,
  authorizeRoles("user"),
  createRequest
);

// ==============================
// GET MY REQUESTS
// ==============================

router.get(
  "/my",
  protect,
  authorizeRoles("user"),
  getMyRequests
);

// ==============================
// GET OWNER REQUESTS
// ==============================

router.get(
  "/owner",
  protect,
  authorizeRoles("owner"),
  getOwnerRequests
);

// ==============================
// APPROVE REQUEST
// ==============================

router.put(
  "/:id/approve",
  protect,
  authorizeRoles("owner"),
  approveRequest
);

// ==============================
// REJECT REQUEST
// ==============================

router.put(
  "/:id/reject",
  protect,
  authorizeRoles("owner"),
  rejectRequest
);

// ==============================
// DELETE REQUEST
// ==============================

router.delete(
  "/:id",
  protect,
  authorizeRoles("user"),
  deleteRequest
);

module.exports = router;