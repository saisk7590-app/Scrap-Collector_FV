const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const ApiResponse = require('../utils/apiResponse');

const JWT_SECRET = env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

/* =======================
   REGISTER
======================= */
exports.register = async (req, res, next) => {
    try {
        const { email, password, fullName, phone, role } = req.body;

        if (!email || !password || !fullName || !phone) {
            return ApiResponse.error(res, "All fields are required", 400);
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return ApiResponse.error(res, "User already exists with this email", 409);
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const userResult = await pool.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email.toLowerCase(), passwordHash]
        );

        const user = userResult.rows[0];

        // Insert profile
        const userRole = role || 'customer';
        const profileResult = await pool.query(
            'INSERT INTO profiles (user_id, full_name, phone, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.id, fullName, phone, userRole]
        );

        const profile = profileResult.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: userRole },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return ApiResponse.success(res, "Registration successful", {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: profile.full_name,
                phone: profile.phone,
                role: profile.role,
                walletBalance: profile.wallet_balance,
            }
        }, 201);

    } catch (err) {
        next(err);
    }
};

/* =======================
   LOGIN
======================= */
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return ApiResponse.error(res, "Email and password are required", 400);
        }

        // Find user
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (userResult.rows.length === 0) {
            return ApiResponse.error(res, "Invalid email or password", 401);
        }

        const user = userResult.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return ApiResponse.error(res, "Invalid email or password", 401);
        }

        // Get profile
        const profileResult = await pool.query(
            'SELECT * FROM profiles WHERE user_id = $1',
            [user.id]
        );

        const profile = profileResult.rows[0];

        if (!profile) {
            return ApiResponse.error(res, "User profile not found", 404);
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: profile.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return ApiResponse.success(res, "Login successful", {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: profile.full_name,
                phone: profile.phone,
                role: profile.role,
                walletBalance: profile.wallet_balance,
            }
        });

    } catch (err) {
        next(err);
    }
};

/* =======================
   FORGOT PASSWORD
======================= */
exports.forgotPassword = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return ApiResponse.error(res, "Email is required", 400);
        }

        const userResult = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (userResult.rows.length === 0) {
            // Don't reveal that user doesn't exist
            return ApiResponse.success(res, "If the email exists, a reset link has been sent");
        }

        // Generate reset token
        const crypto = require('crypto');
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetExpires = new Date(Date.now() + 3600000); // 1 hour

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [resetToken, resetExpires, email.toLowerCase()]
        );

        // TODO: Send email with reset link using nodemailer
        // For now, just return success
        return ApiResponse.success(res, "If the email exists, a reset link has been sent");

    } catch (err) {
        next(err);
    }
};
