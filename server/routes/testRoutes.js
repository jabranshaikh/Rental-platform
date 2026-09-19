const express = require("express");

const { protect } = require("../middleware/authMiddleware");
const { authorizeRoles } = require("../middleware/roleMiddleware");

const router = express.Router();

// ========================================
// User Route
// ========================================

router.get("/user", protect, authorizeRoles("user", "owner", "admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "You can access the user area.",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// ========================================
// Owner Route
// ========================================

router.get("/owner", protect, authorizeRoles("owner"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "You can access the owner area.",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

// ========================================
// Admin Route
// ========================================

router.get("/admin", protect, authorizeRoles("admin"), (req, res) => {
  res.status(200).json({
    success: true,
    message: "You can access the admin area.",
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});

module.exports = router;