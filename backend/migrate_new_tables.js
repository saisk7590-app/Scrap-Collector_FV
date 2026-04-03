const pool = require('./src/config/db');

async function migrate() {
    console.log("Starting DB migration for Pickup Items and Wallet Transactions...");
    const client = await pool.connect();
    
    try {
        await client.query('BEGIN');

        // 1. Add scheduled_date to pickups if it doesn't exist
        console.log("Checking pickups table for scheduled_date...");
        const columnCheck = await client.query(`
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='pickups' AND column_name='scheduled_date'
        `);
        
        if (columnCheck.rows.length === 0) {
            console.log("Adding scheduled_date to pickups...");
            await client.query('ALTER TABLE pickups ADD COLUMN scheduled_date DATE');
        } else {
            console.log("scheduled_date already exists in pickups.");
        }

        // 2. Create pickup_items table
        console.log("Creating pickup_items table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS pickup_items (
                id SERIAL PRIMARY KEY,
                pickup_id INTEGER NOT NULL REFERENCES pickups(id) ON DELETE CASCADE,
                customer_category_id INTEGER REFERENCES scrap_categories(id),
                collector_category_id INTEGER REFERENCES scrap_categories(id),
                customer_weight DECIMAL(10,2) DEFAULT 0.00,
                collector_weight DECIMAL(10,2) DEFAULT 0.00,
                final_price DECIMAL(10,2) DEFAULT 0.00,
                is_modified BOOLEAN DEFAULT FALSE,
                remarks TEXT,
                created_at TIMESTAMPTZ DEFAULT NOW(),
                updated_at TIMESTAMPTZ DEFAULT NOW()
            );
        `);

        // 3. Create collector_wallet_transactions table
        console.log("Creating collector_wallet_transactions table...");
        await client.query(`
            CREATE TABLE IF NOT EXISTS collector_wallet_transactions (
                id SERIAL PRIMARY KEY,
                collector_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                amount DECIMAL(10,2) NOT NULL,
                type VARCHAR(20) NOT NULL CHECK (type IN ('CREDIT', 'DEBIT')),
                description TEXT,
                reference_id INTEGER,
                created_at TIMESTAMPTZ DEFAULT NOW()
            );
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
