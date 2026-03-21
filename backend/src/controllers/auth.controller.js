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
        let { email, password, fullName, phone, role } = req.body;

        if ((!email && !phone) || !password || !fullName) {
            return ApiResponse.error(res, "Full name, Password, and either Email or Phone are required", 400);
        }

        // If email is missing, generate a dummy one from phone
        if (!email && phone) {
            email = `${phone}@scrapcollector.in`;
        }

        // Check if user already exists
        const existingUser = await pool.query(
            'SELECT id FROM users WHERE email = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            return ApiResponse.error(res, "User already exists with this identifier", 409);
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

        // Fetch role_id from roles table
        const userRoleName = role || 'customer';
        const roleResult = await pool.query('SELECT id FROM roles WHERE name = $1', [userRoleName.toLowerCase()]);
        
        if (roleResult.rows.length === 0) {
            return ApiResponse.error(res, "Invalid role", 400);
        }
        
        const roleId = roleResult.rows[0].id;

        // Insert profile
        const profileResult = await pool.query(
            'INSERT INTO profiles (user_id, full_name, phone, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.id, fullName, phone, roleId]
        );

        const profile = profileResult.rows[0];

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: userRoleName },
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
                role: userRoleName,
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
        const { email, phone, password } = req.body;

        if ((!email && !phone) || !password) {
            return ApiResponse.error(res, "Email/Phone and password are required", 400);
        }

        const identifier = (email || phone).toLowerCase();

        // Find user & profile with role join
        const userResult = await pool.query(
            `SELECT u.*, p.full_name, p.phone, p.wallet_balance, r.name as role_name
             FROM users u
             JOIN profiles p ON u.id = p.user_id
             JOIN roles r ON p.role_id = r.id
             WHERE u.email = $1 OR p.phone = $1`,
            [identifier]
        );

        if (userResult.rows.length === 0) {
            return ApiResponse.error(res, "Invalid credentials", 401);
        }

        const user = userResult.rows[0];

        // Compare password
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return ApiResponse.error(res, "Invalid credentials", 401);
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role_name },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        return ApiResponse.success(res, "Login successful", {
            token,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.full_name,
                phone: user.phone,
                role: user.role_name,
                walletBalance: user.wallet_balance,
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
