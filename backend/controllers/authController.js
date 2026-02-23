const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  findUserByPhone,
  createUser,
  verifyUserOTP,
  markUserVerified,
  findVerifiedUserByPhone,
} = require("../models/userModel");

// 🔢 simple OTP generator
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

/* =======================
   REGISTER
======================= */
exports.register = async (req, res) => {
  try {
    const { fullName, phone, password } = req.body;

    if (!fullName || !phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    if (phone.length < 10) {
      return res.status(400).json({ message: "Invalid phone number" });
    }

    const existingUser = await findUserByPhone(phone);
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();

    await createUser(fullName, phone, hashedPassword, otp);

    console.log("OTP (dev only):", otp); // 🔴 DEV ONLY

    res.status(201).json({
      message: "User registered. OTP sent.",
      phone,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   VERIFY OTP
======================= */
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      return res.status(400).json({ message: "Phone and OTP required" });
    }

    // 🔍 DEBUG — THIS IS WHAT YOU ASKED FOR
    console.log("JWT_SECRET:", process.env.JWT_SECRET);

    const user = await verifyUserOTP(phone, otp);

    if (!user) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    await markUserVerified(phone);

    const token = jwt.sign(
      { userId: user.id, phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "OTP verified",
      token,
    });
  } catch (error) {
    console.error("VERIFY OTP ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/* =======================
   LOGIN
======================= */
exports.login = async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await findVerifiedUserByPhone(phone);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.is_verified) {
      return res.status(403).json({ message: "User not verified" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, phone },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({ message: "Server error" });
  }
};
