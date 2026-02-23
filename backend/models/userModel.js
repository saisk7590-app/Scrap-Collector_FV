const pool = require("../config/db");

// 🔍 Find user by phone (used in register)
const findUserByPhone = async (phone) => {
  const result = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );
  return result.rows[0];
};

// ➕ Create new user (register)
const createUser = async (fullName, phone, hashedPassword, otp) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, phone, password, otp)
     VALUES ($1, $2, $3, $4)
     RETURNING id, phone`,
    [fullName, phone, hashedPassword, otp]
  );
  return result.rows[0];
};

// ✅ Verify OTP
const verifyUserOTP = async (phone, otp) => {
  const result = await pool.query(
    `SELECT id
     FROM users
     WHERE phone = $1 AND otp = $2`,
    [phone, otp]
  );
  return result.rows[0];
};

// 🟢 Mark user as verified
const markUserVerified = async (phone) => {
  await pool.query(
    `UPDATE users
     SET is_verified = true, otp = NULL
     WHERE phone = $1`,
    [phone]
  );
};

// 🔐 Find user for login
const findVerifiedUserByPhone = async (phone) => {
  const result = await pool.query(
    `SELECT id, password, is_verified
     FROM users
     WHERE phone = $1`,
    [phone]
  );
  return result.rows[0];
};

// 📦 EXPORT ONCE
module.exports = {
  findUserByPhone,
  createUser,
  verifyUserOTP,
  markUserVerified,
  findVerifiedUserByPhone,
};
