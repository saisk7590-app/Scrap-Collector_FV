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
    const client = await pool.connect();
    try {
        let { email, password, fullName, phone, role } = req.body;

        if ((!email && !phone) || !password || !fullName) {
            return ApiResponse.error(res, "Full name, Password, and either Email or Phone are required", 400);
        }

        const incomingRole = role || 'customer';
        
        // Role mapping to match DB role names
        const roleMap = {
            'government': 'govt_sector',
            'community': 'gated_community',
            'corporate': 'corporate',
            'customer': 'customer',
            'collector': 'collector'
        };
        
        const userRoleName = roleMap[incomingRole.toLowerCase()] || incomingRole.toLowerCase();

        // 1. Check if role exists BEFORE doing anything
        const roleResult = await client.query('SELECT id FROM roles WHERE LOWER(name) = $1', [userRoleName]);
        if (roleResult.rows.length === 0) {
            return ApiResponse.error(res, `Invalid role: ${userRoleName}`, 400);
        }
        const roleId = roleResult.rows[0].id;

        // 2. Generate dummy email if missing
        if (!email && phone) {
            email = `${phone}@scrapcollector.in`;
        }

        await client.query('BEGIN');

        // 3. Check if user already exists
        const existingUser = await client.query(
            'SELECT id FROM users WHERE LOWER(email) = $1',
            [email.toLowerCase()]
        );

        if (existingUser.rows.length > 0) {
            await client.query('ROLLBACK');
            return ApiResponse.error(res, "User already exists with this identifier", 409);
        }

        // 4. Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // 5. Insert user
        const userResult = await client.query(
            'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING id, email, created_at',
            [email.toLowerCase(), passwordHash]
        );
        const user = userResult.rows[0];

        // 6. Insert profile
        const profileResult = await client.query(
            'INSERT INTO profiles (user_id, full_name, phone, role_id) VALUES ($1, $2, $3, $4) RETURNING *',
            [user.id, fullName, phone, roleId]
        );
        const profile = profileResult.rows[0];

        // 7. Insert into role-specific tables & Sync Address
        const normalizedRole = userRoleName.toLowerCase();
        let signupAddress = null;

        if (normalizedRole === 'customer') {
            await client.query('INSERT INTO customers (user_id, profile_id) VALUES ($1, $2)', [user.id, profile.id]);
        } else if (normalizedRole === 'collector') {
            await client.query('INSERT INTO collectors (user_id, profile_id) VALUES ($1, $2)', [user.id, profile.id]);
        } else if (normalizedRole === 'corporate') {
            const { companyName, contactPerson, contactPhone, companyEmail, gstNumber, officeAddress } = req.body;
            signupAddress = officeAddress;
            await client.query(
                `INSERT INTO corporates (user_id, company_name, contact_person, contact_phone, company_email, gst_number, address) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7)`, 
                [user.id, companyName, contactPerson, contactPhone, companyEmail, gstNumber, officeAddress]
            );
        } else if (normalizedRole === 'govt_sector') {
            const { departmentName, officerName, contactNumber, zone, officeLocation } = req.body;
            signupAddress = officeLocation;
            await client.query(
                `INSERT INTO government_sectors (user_id, department_name, officer_name, contact_number, zone, address) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [user.id, departmentName, officerName, contactNumber, zone, officeLocation]
            );
        } else if (normalizedRole === 'gated_community') {
            const { communityName, managerName, managerPhone, totalUnits, areaAddress } = req.body;
            signupAddress = areaAddress;
            await client.query(
                `INSERT INTO gated_communities (user_id, community_name, manager_name, manager_phone, total_units, address) 
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [user.id, communityName, managerName, managerPhone, totalUnits, areaAddress]
            );
        }

        // 8. If an address was provided in signup, sync it to Profile and UserAddresses
        if (signupAddress) {
            // Update profile with the typed address
            await client.query('UPDATE profiles SET address = $1 WHERE user_id = $2', [signupAddress, user.id]);
            
            // Add to Manage Addresses list
            await client.query(
                `INSERT INTO user_addresses (user_id, type, address, is_default) 
                 VALUES ($1, $2, $3, $4)`,
                [user.id, 'Main', signupAddress, true]
            );
        }

        await client.query('COMMIT');

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
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
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
