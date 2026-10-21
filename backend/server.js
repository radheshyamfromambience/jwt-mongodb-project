require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "JWT Authentication API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Start Server
const startServer = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env");
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is missing in .env");
    }

    if (
      process.env.JWT_SECRET ===
      "replace_this_with_a_long_random_secret"
    ) {
      throw new Error("Please configure a secure JWT_SECRET");
    }

    await connectDB();

    const PORT = process.env.PORT || 5001;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server Startup Error:", error.message);
    process.exit(1);
  }
};

startServer();