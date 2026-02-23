const pool = require('../config/db');

/* =======================
   CREATE SCRAP REQUEST
======================= */
exports.createScrapRequest = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalWeight } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ message: "At least one item is required" });
        }

        const result = await pool.query(
            `INSERT INTO scrap_requests (user_id, items, total_weight, status)
       VALUES ($1, $2, $3, 'draft')
       RETURNING *`,
            [userId, JSON.stringify(items), totalWeight || 0]
        );

        return res.status(201).json({
            message: "Scrap request created",
            scrapRequest: result.rows[0]
        });

    } catch (err) {
        console.error("Create scrap request error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

/* =======================
   GET MY SCRAP REQUESTS
======================= */
exports.getMyScrapRequests = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM scrap_requests WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return res.status(200).json({ scrapRequests: result.rows });

    } catch (err) {
        console.error("Get my scrap requests error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};
