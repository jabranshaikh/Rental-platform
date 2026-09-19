const express = require("express");

const {
  getAdminStats,
  getRecentUsers,
  getRecentProperties,
  getRecentRequests,
} = require("../controllers/adminController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ==============================
// ADMIN DASHBOARD STATS
// ==============================

router.get(
  "/stats",
  protect,
  authorizeRoles("admin"),
  getAdminStats
);

// ==============================
// RECENT USERS
// ==============================

router.get(
  "/recent-users",
  protect,
  authorizeRoles("admin"),
  getRecentUsers
);

// ==============================
// RECENT PROPERTIES
// ==============================

router.get(
  "/recent-properties",
  protect,
  authorizeRoles("admin"),
  getRecentProperties
);

// ==============================
// RECENT REQUESTS
// ==============================

router.get(
  "/recent-requests",
  protect,
  authorizeRoles("admin"),
  getRecentRequests
);

module.exports = router;