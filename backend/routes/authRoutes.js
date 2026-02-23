const express = require("express");
const router = express.Router();

const {
  register,
  verifyOtp,
  login,
} = require("../controllers/authController");

// Register user
router.post("/register", register);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login user
router.post("/login", login);

module.exports = router;
