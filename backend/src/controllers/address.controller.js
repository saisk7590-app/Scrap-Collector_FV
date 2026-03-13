const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

/* =======================
   GET ALL ADDRESSES
======================= */
exports.getAddresses = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY is_default DESC, created_at DESC',
            [userId]
        );

        return ApiResponse.success(res, "Addresses retrieved", {
            addresses: result.rows
        });

    } catch (err) {
        next(err);
    }
};

/* =======================
   ADD ADDRESS
======================= */
exports.addAddress = async (req, res, next) => {
    try {
        const { type, house_no, area, pincode, landmark, address, is_default } = req.body;
        const userId = req.user.id;

        if (!address) {
            return ApiResponse.error(res, "Full address is required", 400);
        }

        // If is_default is true, unset other defaults for this user
        if (is_default) {
            await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        const result = await pool.query(
            `INSERT INTO user_addresses (user_id, type, house_no, area, pincode, landmark, address, is_default)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [userId, type || 'Home', house_no || null, area || null, pincode || null, landmark || null, address, is_default || false]
        );

        return ApiResponse.success(res, "Address added successfully", result.rows[0], 201);

    } catch (err) {
        next(err);
    }
};

/* =======================
   UPDATE ADDRESS
======================= */
exports.updateAddress = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { type, house_no, area, pincode, landmark, address, is_default } = req.body;
        const userId = req.user.id;

        // Ensure ownership
        const check = await pool.query('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [id, userId]);
        if (check.rows.length === 0) {
            return ApiResponse.error(res, "Address not found or unauthorized", 404);
        }

        // If is_default is true, unset other defaults
        if (is_default) {
            await pool.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        const result = await pool.query(
            `UPDATE user_addresses 
             SET type = $1, house_no = $2, area = $3, pincode = $4, landmark = $5, address = $6, is_default = $7, updated_at = NOW()
             WHERE id = $8 AND user_id = $9
             RETURNING *`,
            [type, house_no, area, pincode, landmark, address, is_default, id, userId]
        );

        return ApiResponse.success(res, "Address updated successfully", result.rows[0]);

    } catch (err) {
        next(err);
    }
};

/* =======================
   DELETE ADDRESS
======================= */
exports.deleteAddress = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const result = await pool.query(
            'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return ApiResponse.error(res, "Address not found", 404);
        }

        return ApiResponse.success(res, "Address deleted successfully");

    } catch (err) {
        next(err);
    }
};
