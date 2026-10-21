const jwt = require("jsonwebtoken");
const User = require("../models/User");

// =========================
// AUTHENTICATION MIDDLEWARE
// =========================

const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Check Authorization Header
    if (
      !authHeader ||
      !authHeader.startsWith("Bearer ")
    ) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Token is required.",
      });
    }

    // Extract Token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Invalid authorization header",
      });
    }

    // Verify Token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Get current user from database
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    // Attach current user to request
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
    };

    next();
  } catch (error) {
    if (
      error.name === "TokenExpiredError" ||
      error.name === "JsonWebTokenError" ||
      error.name === "NotBeforeError"
    ) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    console.error("Authentication Error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// =========================
// ROLE AUTHORIZATION
// =========================

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "You do not have permission",
      });
    }

    next();
  };
};

module.exports = {
  protect,
  authorizeRoles,
};