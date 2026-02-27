const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

/* =======================
   CREATE SCRAP REQUEST
======================= */
exports.createScrapRequest = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { items, totalWeight } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return ApiResponse.error(res, "At least one item is required", 400);
        }

        const result = await pool.query(
            `INSERT INTO scrap_requests (user_id, items, total_weight, status)
       VALUES ($1, $2, $3, 'draft')
       RETURNING *`,
            [userId, JSON.stringify(items), totalWeight || 0]
        );

        return ApiResponse.success(res, "Scrap request created", { scrapRequest: result.rows[0] }, 201);

    } catch (err) {
        next(err);
    }
};

/* =======================
   GET MY SCRAP REQUESTS
======================= */
exports.getMyScrapRequests = async (req, res, next) => {
    try {
        const userId = req.user.id;

        const result = await pool.query(
            'SELECT * FROM scrap_requests WHERE user_id = $1 ORDER BY created_at DESC',
            [userId]
        );

        return ApiResponse.success(res, "Scrap requests retrieved", { scrapRequests: result.rows });

    } catch (err) {
        next(err);
    }
};
