const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

const ALLOWED_CITY = "Hyderabad";

/* =======================
   CREATE PICKUP (Customer)
======================= */
exports.createPickup = async (req, res, next) => {
    try {
        const { items, totalQty, totalWeight, alternateNumber, timeSlot, city } = req.body;
        const userId = req.user.id;

        // Location Validation
        if (!city || city.toLowerCase() !== ALLOWED_CITY.toLowerCase()) {
            return ApiResponse.error(res, `Service currently available only in ${ALLOWED_CITY}`, 400);
        }

        if (!items || !timeSlot) {
            return ApiResponse.error(res, "Items and time slot are required", 400);
        }

        const result = await pool.query(
            `INSERT INTO pickups (user_id, items, total_qty, total_weight, alternate_number, time_slot, city, status, amount)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'scheduled', 0)
       RETURNING *`,
            [userId, JSON.stringify(items), totalQty || 0, totalWeight || 0, alternateNumber || null, timeSlot, city || ALLOWED_CITY]
        );

        const pickup = result.rows[0];
        // Format human-readable ID: PK + 6-digit padded number
        pickup.display_id = `PK${String(pickup.pickup_no).padStart(6, '0')}`;

        return ApiResponse.success(res, "Pickup scheduled successfully", pickup, 201);

    } catch (err) {
        next(err);
    }
};

/* =======================
   GET MY PICKUPS (Customer)
======================= */
exports.getMyPickups = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM pickups WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        const pickups = result.rows.map(p => ({
            ...p,
            display_id: `PK${String(p.pickup_no).padStart(6, '0')}`
        }));

        return ApiResponse.success(res, "Pickups retrieved", { pickups });

    } catch (err) {
        next(err);
    }
};

/* =======================
   GET TODAY PICKUPS (Collector)
======================= */
exports.getTodayPickups = async (req, res, next) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
        const collectorId = req.user.id; // From auth.middleware

        // Only show pickups that are UNASSIGNED or ASSIGNED TO ME
        const result = await pool.query(
            `SELECT * FROM pickups 
       WHERE created_at >= $1 AND created_at <= $2
       AND (collector_id IS NULL OR collector_id = $3)
       ORDER BY created_at ASC`,
            [startOfDay, endOfDay, collectorId]
        );

        const pickups = result.rows.map(p => ({
            ...p,
            display_id: `PK${String(p.pickup_no).padStart(6, '0')}`
        }));

        return ApiResponse.success(res, "Today's pickups retrieved", { pickups });

    } catch (err) {
        next(err);
    }
};

/* =======================
   GET ALL PICKUPS (Collector/Admin)
======================= */
exports.getAllPickups = async (req, res, next) => {
    try {
        const result = await pool.query(
            'SELECT * FROM pickups ORDER BY created_at DESC'
        );

        const pickups = result.rows.map(p => ({
            ...p,
            display_id: `PK${String(p.pickup_no).padStart(6, '0')}`
        }));

        return ApiResponse.success(res, "All pickups retrieved", { pickups });

    } catch (err) {
        next(err);
    }
};

/* =======================
   UPDATE PICKUP STATUS
======================= */
exports.updatePickupStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status, amount } = req.body;
        const collectorId = req.user.id; // The person making the request

        if (!status) {
            return ApiResponse.error(res, "Status is required", 400);
        }

        const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return ApiResponse.error(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
        }

        // 1. First, check who currently owns this pickup
        const checkResult = await pool.query('SELECT collector_id FROM pickups WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return ApiResponse.error(res, "Pickup not found", 404);
        }

        const currentOwner = checkResult.rows[0].collector_id;

        // 2. Lock mechanism: prevent stealing
        // If it belongs to someone else (not NULL and not ME), deny access
        if (currentOwner !== null && currentOwner !== collectorId) {
            return ApiResponse.error(res, "Another collector has already claimed this pickup", 403);
        }

        // 3. Update the record (and assign ownership if it was NULL)
        let query, params;

        if (amount !== undefined) {
            query = 'UPDATE pickups SET status = $1, amount = $2, collector_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *';
            params = [status, amount, collectorId, id];
        } else {
            query = 'UPDATE pickups SET status = $1, collector_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
            params = [status, collectorId, id];
        }

        const result = await pool.query(query, params);

        const pickup = result.rows[0];
        pickup.display_id = `PK${String(pickup.pickup_no).padStart(6, '0')}`;

        // 4. If status is completed, update user's wallet balance in profiles table
        if (status === 'completed' && amount > 0) {
            try {
                await pool.query(
                    'UPDATE profiles SET wallet_balance = wallet_balance + $1, updated_at = NOW() WHERE user_id = $2',
                    [amount, pickup.user_id]
                );
            } catch (profileErr) {
                console.error("Error updating profile balance:", profileErr);
            }
        }

        return ApiResponse.success(res, "Pickup status updated", { pickup });

    } catch (err) {
        next(err);
    }
};
