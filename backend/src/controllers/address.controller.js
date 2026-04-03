const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

const formatDefaultAddress = (row) => {
    if (!row) {
        return null;
    }

    return [
        row.house_no,
        row.address,
        row.area,
        row.pincode,
    ].filter(Boolean).join(', ');
};

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
    const client = await pool.connect();
    try {
        const { type, house_no, area, pincode, landmark, address, is_default } = req.body;
        const userId = req.user.id;

        if (!address) {
            return ApiResponse.error(res, "Full address is required", 400);
        }

        // If is_default is true, unset other defaults for this user
        await client.query('BEGIN');

        const existingDefaultResult = await client.query(
            'SELECT id FROM user_addresses WHERE user_id = $1 AND is_default = TRUE LIMIT 1',
            [userId]
        );
        const shouldBeDefault = Boolean(is_default) || existingDefaultResult.rows.length === 0;

        if (shouldBeDefault) {
            await client.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        const result = await client.query(
            `INSERT INTO user_addresses (user_id, type, house_no, area, pincode, landmark, address, is_default)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
             RETURNING *`,
            [userId, type || 'Home', house_no || null, area || null, pincode || null, landmark || null, address, shouldBeDefault]
        );

        if (result.rows[0]?.is_default) {
            await client.query(
                'UPDATE profiles SET address = $1, updated_at = NOW() WHERE user_id = $2',
                [formatDefaultAddress(result.rows[0]), userId]
            );
        }

        await client.query('COMMIT');

        return ApiResponse.success(res, "Address added successfully", result.rows[0], 201);

    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

/* =======================
   UPDATE ADDRESS
======================= */
exports.updateAddress = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { type, house_no, area, pincode, landmark, address, is_default } = req.body;
        const userId = req.user.id;

        // Ensure ownership
        const check = await client.query('SELECT id FROM user_addresses WHERE id = $1 AND user_id = $2', [id, userId]);
        if (check.rows.length === 0) {
            return ApiResponse.error(res, "Address not found or unauthorized", 404);
        }

        await client.query('BEGIN');

        // If is_default is true, unset other defaults
        const otherDefaultResult = await client.query(
            'SELECT id FROM user_addresses WHERE user_id = $1 AND id <> $2 AND is_default = TRUE LIMIT 1',
            [userId, id]
        );
        const shouldBeDefault = Boolean(is_default) || otherDefaultResult.rows.length === 0;

        if (shouldBeDefault) {
            await client.query('UPDATE user_addresses SET is_default = FALSE WHERE user_id = $1', [userId]);
        }

        const result = await client.query(
            `UPDATE user_addresses 
             SET type = $1, house_no = $2, area = $3, pincode = $4, landmark = $5, address = $6, is_default = $7, updated_at = NOW()
             WHERE id = $8 AND user_id = $9
             RETURNING *`,
            [type, house_no, area, pincode, landmark, address, shouldBeDefault, id, userId]
        );

        if (result.rows[0]?.is_default) {
            await client.query(
                'UPDATE profiles SET address = $1, updated_at = NOW() WHERE user_id = $2',
                [formatDefaultAddress(result.rows[0]), userId]
            );
        }

        await client.query('COMMIT');

        return ApiResponse.success(res, "Address updated successfully", result.rows[0]);

    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

/* =======================
   DELETE ADDRESS
======================= */
exports.deleteAddress = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const userId = req.user.id;
        const { id } = req.params;

        await client.query('BEGIN');

        const result = await client.query(
            'DELETE FROM user_addresses WHERE id = $1 AND user_id = $2 RETURNING *',
            [id, userId]
        );

        if (result.rows.length === 0) {
            return ApiResponse.error(res, "Address not found", 404);
        }

        const deletedAddress = result.rows[0];

        if (deletedAddress.is_default) {
            const fallbackResult = await client.query(
                `UPDATE user_addresses
                 SET is_default = TRUE, updated_at = NOW()
                 WHERE id = (
                    SELECT id
                    FROM user_addresses
                    WHERE user_id = $1
                    ORDER BY updated_at DESC NULLS LAST, created_at DESC
                    LIMIT 1
                 )
                 RETURNING *`,
                [userId]
            );

            const fallbackAddress = fallbackResult.rows[0];
            await client.query(
                'UPDATE profiles SET address = $1, updated_at = NOW() WHERE user_id = $2',
                [formatDefaultAddress(fallbackAddress), userId]
            );
        }

        await client.query('COMMIT');

        return ApiResponse.success(res, "Address deleted successfully");

    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};
