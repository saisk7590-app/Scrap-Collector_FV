const pool = require('./src/config/db');

async function migrate() {
    console.log("Starting DB migration for Flexible Measurements and Pickup Dates...");
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Update scrap_categories table
        console.log("Updating scrap_categories table...");
        await client.query(`
            ALTER TABLE scrap_categories 
            ADD COLUMN IF NOT EXISTS has_weight BOOLEAN DEFAULT TRUE,
            ADD COLUMN IF NOT EXISTS has_quantity BOOLEAN DEFAULT FALSE;
        `);

        // Update default rules
        await client.query("UPDATE scrap_categories SET has_weight = TRUE, has_quantity = FALSE WHERE name IN ('Paper', 'Plastic', 'Metal', 'Glass')");
        await client.query("UPDATE scrap_categories SET has_weight = TRUE, has_quantity = TRUE WHERE name = 'E-Waste'");
        
        // Ensure 'Large appliances' exists
        const largeAppCheck = await client.query("SELECT id FROM scrap_categories WHERE name = 'Large appliances'");
        if (largeAppCheck.rows.length === 0) {
            await client.query("INSERT INTO scrap_categories (name, icon_name, icon_bg, card_bg, has_weight, has_quantity) VALUES ('Large appliances', 'truck', '#fef3c7', '#f59e0b', FALSE, TRUE)");
        } else {
            await client.query("UPDATE scrap_categories SET has_weight = FALSE, has_quantity = TRUE WHERE name = 'Large appliances'");
        }

        // 2. Update pickup_items table
        console.log("Updating pickup_items table...");
        await client.query(`
            ALTER TABLE pickup_items 
            ADD COLUMN IF NOT EXISTS measurement_type VARCHAR(20) DEFAULT 'weight';
        `);

        // 3. Update pickups table
        console.log("Updating pickups table...");
        await client.query(`
            ALTER TABLE pickups 
            ADD COLUMN IF NOT EXISTS pickup_date DATE DEFAULT CURRENT_DATE;
        `);

        await client.query('COMMIT');
        console.log("Migration completed successfully.");

    } catch (err) {
        await client.query('ROLLBACK');
        console.error("Error during migration:", err);
    } finally {
        client.release();
        process.exit();
    }
}

migrate();
