const pool = require('../config/db');
const ApiResponse = require('../utils/apiResponse');

const ALLOWED_CITY = "Hyderabad";

const toPositiveNumber = (value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
};

const resolveCategoryId = async (client, item, pickupId = null) => {
    const explicitCategoryId = toPositiveNumber(
        item.collector_category_id || item.categoryId || item.category_id
    );

    if (explicitCategoryId) {
        const categoryResult = await client.query(
            'SELECT id FROM scrap_categories WHERE id = $1',
            [explicitCategoryId]
        );

        if (categoryResult.rows.length > 0) {
            return explicitCategoryId;
        }
    }

    const scrapItemId = toPositiveNumber(item.itemId || item.item_id || item.scrap_item_id);
    if (scrapItemId) {
        const scrapItemResult = await client.query(
            'SELECT category_id FROM scrap_items WHERE id = $1',
            [scrapItemId]
        );

        if (scrapItemResult.rows.length > 0) {
            return Number(scrapItemResult.rows[0].category_id);
        }
    }

    const scrapItemName = (item.category || item.name || '').trim();
    if (scrapItemName) {
        const scrapItemByName = await client.query(
            'SELECT category_id FROM scrap_items WHERE LOWER(name) = LOWER($1) LIMIT 1',
            [scrapItemName]
        );

        if (scrapItemByName.rows.length > 0) {
            return Number(scrapItemByName.rows[0].category_id);
        }
    }

    const pickupItemId = toPositiveNumber(item.pickup_item_id || item.pickupItemId);
    if (pickupId && pickupItemId) {
        const pickupItemResult = await client.query(
            `SELECT customer_category_id, collector_category_id
             FROM pickup_items
             WHERE id = $1 AND pickup_id = $2`,
            [pickupItemId, pickupId]
        );

        if (pickupItemResult.rows.length > 0) {
            return Number(
                pickupItemResult.rows[0].collector_category_id ||
                pickupItemResult.rows[0].customer_category_id
            );
        }
    }

    return null;
};

const resolvePickupItemId = async (client, pickupId, item) => {
    const explicitPickupItemId = toPositiveNumber(item.pickup_item_id || item.pickupItemId);
    if (explicitPickupItemId) {
        return explicitPickupItemId;
    }

    const ambiguousId = toPositiveNumber(item.id);
    if (!ambiguousId) {
        return null;
    }

    const existingRow = await client.query(
        'SELECT id FROM pickup_items WHERE id = $1 AND pickup_id = $2',
        [ambiguousId, pickupId]
    );

    return existingRow.rows.length > 0 ? ambiguousId : null;
};

/* =======================
   CREATE PICKUP (Customer)
======================= */
exports.createPickup = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { items, totalQty, totalWeight, alternateNumber, timeSlot, city, pickupDate } = req.body;
        const userId = req.user.id;

        // Location Validation
        if (!city || city.toLowerCase() !== ALLOWED_CITY.toLowerCase()) {
            return ApiResponse.error(res, `Service currently available only in ${ALLOWED_CITY}`, 400);
        }

        if (!items || !timeSlot || !pickupDate) {
            return ApiResponse.error(res, "Items, time slot, and pickup date are required", 400);
        }

        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO pickups (user_id, items, total_qty, total_weight, alternate_number, time_slot, pickup_date, city, status, amount)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled', 0)
             RETURNING *`,
            [userId, JSON.stringify(items), totalQty || 0, totalWeight || 0, alternateNumber || null, timeSlot, pickupDate, city || ALLOWED_CITY]
        );

        const pickup = result.rows[0];
        pickup.display_id = `PK${String(pickup.pickup_no).padStart(6, '0')}`;

        // Insert into pickup_items table
        if (Array.isArray(items)) {
            for (const item of items) {
                // Determine category_id (accounting for item data from frontend)
                const catId = await resolveCategoryId(client, item, pickup.id);
                const weight = item.weight || 0;
                const measurementType = item.measurement_type || 'weight';
                
                if (catId) {
                    await client.query(
                        `INSERT INTO pickup_items (pickup_id, customer_category_id, collector_category_id, customer_weight, collector_weight, measurement_type)
                         VALUES ($1, $2, $3, $4, $5, $6)`,
                        [pickup.id, catId, catId, weight, weight, measurementType]
                    );
                }
            }
        }

        await client.query('COMMIT');
        return ApiResponse.success(res, "Pickup scheduled successfully", pickup, 201);

    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

/* =======================
   GET MY PICKUPS (Customer)
======================= */
exports.getMyPickups = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const result = await pool.query(
            `SELECT p.*, prof.full_name as customer_name, prof.phone as customer_phone, prof.address as customer_profile_address
             FROM pickups p
             LEFT JOIN profiles prof ON p.user_id = prof.user_id
             WHERE p.user_id = $1 
             ORDER BY p.created_at DESC`,
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
        const collectorId = req.user.id;

        const result = await pool.query(
            `SELECT p.*, prof.full_name as customer_name, prof.phone as customer_phone, prof.address as customer_profile_address
             FROM pickups p
             LEFT JOIN profiles prof ON p.user_id = prof.user_id
             WHERE p.created_at >= $1 AND p.created_at <= $2
             AND (p.collector_id IS NULL OR p.collector_id = $3)
             ORDER BY p.created_at ASC`,
            [startOfDay, endOfDay, collectorId]
        );

        const pickups = result.rows.map(p => ({ ...p, display_id: `PK${String(p.pickup_no).padStart(6, '0')}` }));
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
            `SELECT p.*, prof.full_name as customer_name, prof.phone as customer_phone
             FROM pickups p
             LEFT JOIN profiles prof ON p.user_id = prof.user_id
             ORDER BY p.created_at DESC`
        );
        const pickups = result.rows.map(p => ({ ...p, display_id: `PK${String(p.pickup_no).padStart(6, '0')}` }));
        return ApiResponse.success(res, "All pickups retrieved", { pickups });
    } catch (err) {
        next(err);
    }
};

/* =======================
   GET PICKUP DETAILS
======================= */
exports.getPickupDetails = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        const result = await pool.query(
            `SELECT p.*, prof.full_name as customer_name, prof.phone as customer_phone, prof.address as customer_address
             FROM pickups p
             LEFT JOIN profiles prof ON p.user_id = prof.user_id
             WHERE p.id = $1`, [id]
        );
        
        if (result.rows.length === 0) {
            return ApiResponse.error(res, "Pickup not found", 404);
        }
        
        const pickup = result.rows[0];
        pickup.display_id = `PK${String(pickup.pickup_no).padStart(6, '0')}`;
        
        const itemsResult = await pool.query(
            `SELECT pi.*, 
                    cc.name as customer_category_name, cc.base_price as customer_base_price,
                    col_cat.name as collector_category_name, col_cat.base_price as collector_base_price
             FROM pickup_items pi
             LEFT JOIN scrap_categories cc ON pi.customer_category_id = cc.id
             LEFT JOIN scrap_categories col_cat ON pi.collector_category_id = col_cat.id
             WHERE pi.pickup_id = $1`, [id]
        );
        
        pickup.detailed_items = itemsResult.rows;
        
        return ApiResponse.success(res, "Pickup details retrieved", { pickup });
    } catch (err) {
        next(err);
    }
};

/* =======================
   UPDATE PICKUP STATUS / COMPLETE
======================= */
exports.updatePickupStatus = async (req, res, next) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { status, remarks, finalItems } = req.body;
        const collectorId = req.user.id;

        if (!status) {
            return ApiResponse.error(res, "Status is required", 400);
        }

        const validStatuses = ['scheduled', 'in_progress', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return ApiResponse.error(res, `Status must be one of: ${validStatuses.join(', ')}`, 400);
        }

        // 1. First, check who currently owns this pickup
        const checkResult = await client.query('SELECT collector_id, status FROM pickups WHERE id = $1', [id]);
        if (checkResult.rows.length === 0) {
            return ApiResponse.error(res, "Pickup not found", 404);
        }

        const currentOwner = checkResult.rows[0].collector_id;
        
        if (currentOwner !== null && currentOwner !== collectorId) {
            return ApiResponse.error(res, "Another collector has already claimed this pickup", 403);
        }

        await client.query('BEGIN');

        // If completed, process the items and calculate total amount
        let finalAmount = 0;
        
        if (status === 'completed') {
            if (!remarks) {
                await client.query('ROLLBACK');
                return ApiResponse.error(res, "Remarks are required for completing a pickup", 400);
            }

            // Update pickup items if provided
            if (finalItems && Array.isArray(finalItems)) {
                for (const item of finalItems) {
                    const pickupItemId = await resolvePickupItemId(client, id, item);
                    const categoryId = await resolveCategoryId(client, item, id);

                    if (!categoryId) {
                        await client.query('ROLLBACK');
                        return ApiResponse.error(res, "Invalid scrap category selected for one or more items", 400);
                    }

                    if (pickupItemId) {
                        // Update existing item
                        const itemAmount = (item.collector_weight || 0) * (item.price || 0); // Assuming frontend sends price per unit
                        finalAmount += itemAmount;
                        
                        await client.query(
                            `UPDATE pickup_items 
                             SET collector_category_id = $1, collector_weight = $2, final_price = $3, is_modified = $4, remarks = $5
                              WHERE id = $6 AND pickup_id = $7`,
                            [categoryId, item.collector_weight, itemAmount, item.is_modified, item.remarks, pickupItemId, id]
                        );
                    } else {
                        // Add new item added by collector
                        const itemAmount = (item.collector_weight || 0) * (item.price || 0);
                        finalAmount += itemAmount;
                        
                        await client.query(
                            `INSERT INTO pickup_items (pickup_id, collector_category_id, collector_weight, final_price, is_modified, remarks)
                             VALUES ($1, $2, $3, $4, true, $5)`,
                            [id, categoryId, item.collector_weight, itemAmount, item.remarks]
                        );
                    }
                }
            } else {
                // If finalItems not provided, calculate amount from DB state
                const currentItems = await client.query(`SELECT pi.*, sc.base_price FROM pickup_items pi LEFT JOIN scrap_categories sc ON pi.collector_category_id = sc.id WHERE pi.pickup_id = $1`, [id]);
                for (const row of currentItems.rows) {
                    finalAmount += parseFloat(row.collector_weight || 0) * parseFloat(row.base_price || 0);
                }
            }

            // Wallet Ledger Logic
            // Debit money from collector wallet
            await client.query(
                `INSERT INTO collector_wallet_transactions (collector_id, amount, type, description, reference_id)
                 VALUES ($1, $2, 'DEBIT', $3, $4)`,
                [collectorId, finalAmount, `Paid to customer for Pickup PK${String(id).padStart(6, '0')}`, id]
            );

            // Update user wallet balance safely using subquery or direct profile check
            const pickupUserIdResult = await client.query('SELECT user_id FROM pickups WHERE id = $1', [id]);
            if (pickupUserIdResult.rows.length > 0) {
                const customerUserId = pickupUserIdResult.rows[0].user_id;

                await client.query(
                    'UPDATE profiles SET wallet_balance = wallet_balance + $1, updated_at = NOW() WHERE user_id = $2',
                    [finalAmount, customerUserId]
                );

                await client.query(
                    `INSERT INTO wallet_transactions (user_id, amount, type, description)
                     VALUES ($1, $2, 'CREDIT', $3)`,
                    [customerUserId, finalAmount, `Pickup completed for PK${String(id).padStart(6, '0')}`]
                );
            }
        }

        // Update the pickup record
        let query, params;

        if (status === 'completed') {
             query = 'UPDATE pickups SET status = $1, amount = $2, collector_id = $3, updated_at = NOW() WHERE id = $4 RETURNING *';
             params = [status, finalAmount, collectorId, id];
        } else {
             query = 'UPDATE pickups SET status = $1, collector_id = $2, updated_at = NOW() WHERE id = $3 RETURNING *';
             params = [status, collectorId, id];
        }

        const result = await client.query(query, params);

        await client.query('COMMIT');

        const pickup = result.rows[0];
        pickup.display_id = `PK${String(pickup.pickup_no).padStart(6, '0')}`;
        
        return ApiResponse.success(res, "Pickup status updated", { pickup });

    } catch (err) {
        await client.query('ROLLBACK');
        next(err);
    } finally {
        client.release();
    }
};

/* =======================
   GET COLLECTOR HISTORY
======================= */
exports.getCollectorHistory = async (req, res, next) => {
    try {
        const collectorId = req.user.id;
        const result = await pool.query(
            `SELECT p.*, prof.full_name as customer_name, prof.phone as customer_phone
             FROM pickups p
             JOIN profiles prof ON p.user_id = prof.user_id
             WHERE p.collector_id = $1 AND p.status = 'completed'
             ORDER BY p.updated_at DESC`,
            [collectorId]
        );
        const pickups = result.rows.map(p => ({
            ...p,
            display_id: `PK${String(p.pickup_no).padStart(6, '0')}`
        }));
        return ApiResponse.success(res, "Collector history retrieved", { pickups });
    } catch (err) {
        next(err);
    }
};
