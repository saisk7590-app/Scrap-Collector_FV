const pool = require('./src/config/db');

async function fixDatabase() {
    console.log("🚀 Starting Database Fix for Prices and Images...");
    
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        // 1. Update Base Prices for Scrap Items (if missing)
        console.log("📝 Updating base prices for scrap_items...");
        await client.query(`
            UPDATE scrap_items SET base_price = 10 WHERE name ILIKE '%paper%' AND (base_price = 0 OR base_price IS NULL);
            UPDATE scrap_items SET base_price = 15 WHERE name ILIKE '%plastic%' AND (base_price = 0 OR base_price IS NULL);
            UPDATE scrap_items SET base_price = 45 WHERE name ILIKE '%metal%' AND (base_price = 0 OR base_price IS NULL);
            UPDATE scrap_items SET base_price = 25 WHERE name ILIKE '%glass%' AND (base_price = 0 OR base_price IS NULL);
            UPDATE scrap_items SET base_price = 60 WHERE name ILIKE '%ewaste%' AND (base_price = 0 OR base_price IS NULL);
            UPDATE scrap_items SET base_price = 12 WHERE name ILIKE '%cardboard%' AND (base_price = 0 OR base_price IS NULL);
        `);

        // 2. Fix JSON items in pickups table
        console.log("📦 Syncing prices in existing PICKUPS JSON data...");
        const pickupsResult = await client.query(`
            UPDATE pickups
            SET items = (
                SELECT jsonb_agg(
                    item || jsonb_build_object(
                        'price', COALESCE((item->>'price')::numeric, si.base_price, 0),
                        'type', COALESCE(item->>'type', item->>'measurement_type', si.measurement_type, 'weight'),
                        'measurement_type', COALESCE(item->>'measurement_type', item->>'type', si.measurement_type, 'weight')
                    )
                )
                FROM jsonb_array_elements(items) AS item
                LEFT JOIN scrap_items si ON LOWER(si.name) = LOWER(item->>'name')
            )
            WHERE items IS NOT NULL AND jsonb_array_length(items) > 0
            RETURNING id;
        `);
        console.log(`✅ Fixed ${pickupsResult.rowCount} pickup records.`);

        // 3. Fix JSON items in scrap_requests table
        console.log("📬 Syncing prices in existing SCRAP_REQUESTS JSON data...");
        const requestsResult = await client.query(`
            UPDATE scrap_requests
            SET items = (
                SELECT jsonb_agg(
                    item || jsonb_build_object(
                        'price', COALESCE((item->>'price')::numeric, si.base_price, 0),
                        'type', COALESCE(item->>'type', item->>'measurement_type', si.measurement_type, 'weight')
                    )
                )
                FROM jsonb_array_elements(items) AS item
                LEFT JOIN scrap_items si ON LOWER(si.name) = LOWER(item->>'name')
            )
            WHERE items IS NOT NULL AND jsonb_array_length(items) > 0
            RETURNING id;
        `);
        console.log(`✅ Fixed ${requestsResult.rowCount} scrap request records.`);

        await client.query('COMMIT');
        console.log("✨ Database fix completed successfully!");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Error fixing database:", err.message);
    } finally {
        client.release();
        process.exit();
    }
}

fixDatabase();
