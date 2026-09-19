const express = require("express");

const {
  registerUser,
  loginUser,
  getCurrentUser
} = require("../controllers/authController");

const {
  protect
} = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// Public Routes
// ========================================

router.post("/register", registerUser);

router.post("/login", loginUser);

// ========================================
// Protected Routes
// ========================================

router.get("/me", protect, getCurrentUser);

module.exports = router;