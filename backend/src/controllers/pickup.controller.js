const pool = require('../config/db');

const ALLOWED_CITY = "Hyderabad";

/* =======================
   CREATE PICKUP (Customer)
======================= */
exports.createPickup = async (req, res) => {
    try {
        const { items, totalQty, totalWeight, alternateNumber, timeSlot, city } = req.body;
        const userId = req.user.id;

        // Location Validation
        if (!city || city.toLowerCase() !== ALLOWED_CITY.toLowerCase()) {
            return res.status(400).json({
                message: `Service currently available only in ${ALLOWED_CITY}`,
            });
        }

        if (!items || !timeSlot) {
            return res.status(400).json({ message: "Items and time slot are required" });
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

        return res.status(201).json({
            message: "Pickup scheduled successfully",
            pickup
        });

    } catch (err) {
        console.error("Create pickup error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   GET MY PICKUPS (Customer)
======================= */
exports.getMyPickups = async (req, res) => {
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

        return res.status(200).json({ pickups });

    } catch (err) {
        console.error("Get my pickups error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   GET TODAY PICKUPS (Collector)
======================= */
exports.getTodayPickups = async (req, res) => {
    try {
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0).toISOString();
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();

        const result = await pool.query(
            `SELECT * FROM pickups 
       WHERE created_at >= $1 AND created_at <= $2 
       ORDER BY created_at ASC`,
            [startOfDay, endOfDay]
        );

        const pickups = result.rows.map(p => ({
            ...p,
            display_id: `PK${String(p.pickup_no).padStart(6, '0')}`
        }));

        return res.status(200).json({ pickups });

    } catch (err) {
        console.error("Get today pickups error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   GET ALL PICKUPS (Collector/Admin)
======================= */
exports.getAllPickups = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM pickups ORDER BY created_at DESC'
        );

        const pickups = result.rows.map(p => ({
            ...p,
            display_id: `PK${String(p.pickup_no).padStart(6, '0')}`
        }));

        return res.status(200).json({ pickups });

    } catch (err) {
        console.error("Get all pickups error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   UPDATE PICKUP STATUS
======================= */
exports.updatePickupStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, amount } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: `Status must be one of: ${validStatuses.join(', ')}` });
        }

        let query, params;

        if (amount !== undefined) {
            query = 'UPDATE pickups SET status = $1, amount = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
            params = [status, amount, id];
        } else {
            query = 'UPDATE pickups SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *';
            params = [status, id];
        }

        const result = await pool.query(query, params);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Pickup not found" });
        }

        const pickup = result.rows[0];
        pickup.display_id = `PK${String(pickup.pickup_no).padStart(6, '0')}`;

        // ✅ If status is completed, update user's wallet balance in profiles table
        if (status === 'completed' && amount > 0) {
            try {
                await pool.query(
                    'UPDATE profiles SET wallet_balance = wallet_balance + $1, updated_at = NOW() WHERE user_id = $2',
                    [amount, pickup.user_id]
                );
            } catch (profileErr) {
                console.error("Error updating profile balance:", profileErr);
                // Note: We don't fail the whole request if profile update fails, 
                // but we log it. In production, this should be a transaction.
            }
        }

        return res.status(200).json({
            message: "Pickup status updated",
            pickup
        });

    } catch (err) {
        console.error("Update pickup status error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
