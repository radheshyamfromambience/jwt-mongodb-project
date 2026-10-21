const express = require("express");

const {
  protect,
  authorizeRoles,
} = require("../middleware/authMiddleware");

const User = require("../models/User");

const router = express.Router();

// =========================
// PROTECTED PROFILE API
// GET /api/users/profile
// =========================

router.get("/profile", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Profile fetched successfully",

    user: req.user,
  });
});

// =========================
// STUDENT + ADMIN API
// GET /api/users/dashboard
// =========================

router.get("/dashboard", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome to your dashboard",

    data: {
      name: req.user.name,
      role: req.user.role,
    },
  });
});

// =========================
// ADMIN ONLY API
// GET /api/users/admin
// =========================

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  async (req, res) => {
    try {
      const users = await User.find()
        .select("name email role createdAt");

      return res.status(200).json({
        success: true,
        message: "Admin access granted",
        totalUsers: users.length,
        users,
      });
    } catch (error) {
      console.error("Admin API Error:", error.message);

      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  }
);

module.exports = router;