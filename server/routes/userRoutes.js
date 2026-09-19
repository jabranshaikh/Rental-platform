const express = require("express");

const {
  registerUser,
  loginUser,
  getUsers,
  getUserById,
  getProfile,
} = require("../controllers/userController");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();


// ==============================
// PUBLIC ROUTES
// ==============================

router.post(
  "/register",
  registerUser
);

router.post(
  "/login",
  loginUser
);


// ==============================
// PROTECTED ROUTES
// ==============================

// Current logged-in user
router.get(
  "/profile",
  protect,
  getProfile
);


// ==============================
// ADMIN ROUTES
// ==============================

// Get all users
router.get(
  "/",
  protect,
  authorizeRoles("admin"),
  getUsers
);


// Get single user
router.get(
  "/:id",
  protect,
  authorizeRoles("admin"),
  getUserById
);


module.exports = router;