const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'scrap_collector_super_secret_key';
const JWT_EXPIRES_IN = '7d';

/* =======================
   REGISTER
======================= */
exports.register = async (req, res) => {
    try {
        const { email, password, fullName, phone, role } = req.body;

        if (!email || !password || !fullName || !phone) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({ message: "User already exists with this email" });
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

        return res.status(201).json({
            message: "Registration successful",
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
        console.error("Register error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   LOGIN
======================= */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        // Find user
        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = userResult.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Get profile
        const profileResult = await pool.query(
            'SELECT * FROM profiles WHERE user_id = $1',
            [user.id]
        );

        const profile = profileResult.rows[0];

        if (!profile) {
            return res.status(404).json({ message: "User profile not found" });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: profile.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return res.status(200).json({
            message: "Login successful",
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
        console.error("Login error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   FORGOT PASSWORD
======================= */
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const userResult = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (userResult.rows.length === 0) {
            // Don't reveal that user doesn't exist
            return res.status(200).json({ message: "If the email exists, a reset link has been sent" });
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
        return res.status(200).json({
            message: "If the email exists, a reset link has been sent"
        });

    } catch (err) {
        console.error("Forgot password error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
