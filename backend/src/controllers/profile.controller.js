const pool = require('../config/db');

/* =======================
   GET PROFILE
======================= */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM profiles WHERE user_id = $1',
            [userId]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const profile = result.rows[0];

        return res.status(200).json({
            profile: {
                id: profile.id,
                userId: profile.user_id,
                fullName: profile.full_name,
                phone: profile.phone,
                role: profile.role,
                walletBalance: profile.wallet_balance,
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
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { fullName, phone } = req.body;

        if (!fullName && !phone) {
            return res.status(400).json({ message: "At least one field is required" });
        }

        // Build dynamic update
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

        fields.push(`updated_at = NOW()`);
        values.push(userId);

        const query = `UPDATE profiles SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`;

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Profile not found" });
        }

        const profile = result.rows[0];

        return res.status(200).json({
            message: "Profile updated",
            profile: {
                id: profile.id,
                userId: profile.user_id,
                fullName: profile.full_name,
                phone: profile.phone,
                role: profile.role,
                walletBalance: profile.wallet_balance,
            }
        });

    } catch (err) {
        console.error("Update profile error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
