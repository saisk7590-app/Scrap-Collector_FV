const pool = require('./src/config/db');

async function syncPickupItems() {
    console.log("🚀 Starting Production Data Sync for pickup_items...");
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // Get a default category ID just in case
        const firstCatRes = await client.query('SELECT id FROM scrap_categories LIMIT 1');
        const defaultCategoryId = firstCatRes.rows[0]?.id;

        if (!defaultCategoryId) {
            throw new Error("No categories found in scrap_categories table. Please add categories first.");
        }

        // 1. Get all pickups that have items in JSON
        const pickups = await client.query('SELECT id, items FROM pickups WHERE items IS NOT NULL AND jsonb_array_length(items) > 0');
        console.log(`📊 Found ${pickups.rows.length} pickups to process.`);

        let syncedCount = 0;
        let skippedCount = 0;

        for (const pickup of pickups.rows) {
            const items = Array.isArray(pickup.items) ? pickup.items : JSON.parse(pickup.items);
            
            for (const item of items) {
                // Check if this item already exists in pickup_items for this pickup
                // We use name and pickup_id as a loose identifier
                const exists = await client.query(
                    'SELECT id FROM pickup_items WHERE pickup_id = $1 AND (remarks = $2 OR (customer_weight = $3 AND customer_category_id IS NOT NULL))',
                    [pickup.id, item.name, parseFloat(item.weight || item.quantity || 0)]
                );

                if (exists.rows.length === 0) {
                    // Robust Category Resolution
                    let categoryId = null;

                    // Option A: Explicit ID (Strict validation)
                    const explicitId = parseInt(item.categoryId || item.category_id);
                    if (!isNaN(explicitId)) {
                        const check = await client.query('SELECT id FROM scrap_categories WHERE id = $1', [explicitId]);
                        if (check.rows.length > 0) categoryId = explicitId;
                    }

                    // Option B: Item lookup
                    if (!categoryId) {
                        const itemLookup = await client.query(
                            'SELECT category_id FROM scrap_items WHERE LOWER(name) = LOWER($1) OR id = $2 LIMIT 1',
                            [item.name, parseInt(item.item_id || item.itemId) || 0]
                        );
                        categoryId = itemLookup.rows[0]?.category_id;
                    }

                    // Option C: Category Name lookup
                    if (!categoryId) {
                        const catLookup = await client.query(
                            'SELECT id FROM scrap_categories WHERE LOWER(name) = LOWER($1) LIMIT 1',
                            [item.category || item.name]
                        );
                        categoryId = catLookup.rows[0]?.id;
                    }

                    // Option D: Default
                    if (!categoryId) {
                        console.log(`⚠️  Warning: Could not find category for "${item.name}". Using default ID: ${defaultCategoryId}`);
                        categoryId = defaultCategoryId;
                    }

                    // Insert into pickup_items
                    await client.query(
                        `INSERT INTO pickup_items (
                            pickup_id, customer_category_id, collector_category_id, 
                            customer_weight, collector_weight, final_price, 
                            remarks, measurement_type
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
                        [
                            pickup.id, 
                            categoryId, 
                            categoryId, 
                            parseFloat(item.weight || item.quantity || 0), 
                            parseFloat(item.weight || item.quantity || 0), 
                            parseFloat(item.price || 0) * parseFloat(item.weight || item.quantity || 0),
                            item.name.substring(0, 250), 
                            item.type || item.measurement_type || 'weight'
                        ]
                    );
                    syncedCount++;
                } else {
                    skippedCount++;
                }
            }
        }

        await client.query('COMMIT');
        console.log(`✅ Sync completed: ${syncedCount} items added, ${skippedCount} items already existed.`);

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Error syncing data:", err.message);
    } finally {
        client.release();
        process.exit();
    }
}

syncPickupItems();
