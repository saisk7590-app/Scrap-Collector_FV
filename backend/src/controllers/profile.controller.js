const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

/* =======================
   GET PROFILE
======================= */
exports.getProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            `SELECT p.*, r.name as role_name
             FROM profiles p
             JOIN roles r ON p.role_id = r.id
             WHERE p.user_id = $1`,
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const profile = result.rows[0];

        return ApiResponse.success(res, "Profile retrieved", {
            profile: {
                id: profile.id,
                userId: profile.user_id,
                fullName: profile.full_name,
                phone: profile.phone,
                role: profile.role_name,
                walletBalance: profile.wallet_balance,
                address: profile.address,
                createdAt: profile.created_at,
            }
        });

    } catch (err) {
        console.error("Get profile error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   UPDATE PROFILE
======================= */
exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { fullName, phone, address } = req.body;
 
        if (!fullName && !phone && !address) {
            return res.status(400).json({ message: "At least one field is required" });
        }

        // Build dynamic update (profiles table)
        const fields = [];
        const values = [];
        let paramIndex = 1;

        if (fullName) {
            fields.push(`full_name = $${paramIndex++}`);
            values.push(fullName);
        }

        if (phone) {
            fields.push(`phone = $${paramIndex++}`);
            values.push(phone);
        }
 
        if (address) {
            fields.push(`address = $${paramIndex++}`);
            values.push(address);
        }

        fields.push(`updated_at = NOW()`);
        values.push(userId);

        const query = `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return ApiResponse.error(res, "Profile not found", 404);
        }

        const profile = result.rows[0];

        // Fetch role name for response
        const roleResult = await pool.query('SELECT name FROM roles WHERE id = $1', [profile.role_id]);
        const roleName = roleResult.rows[0]?.name || 'unknown';

        return ApiResponse.success(res, "Profile updated", {
            profile: {
                id: profile.id,
                userId: profile.user_id,
                fullName: profile.full_name,
                phone: profile.phone,
                role: roleName,
                walletBalance: profile.wallet_balance,
                address: profile.address,
            }
        });

    } catch (err) {
        next(err);
    }
};
