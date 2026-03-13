const pool = require('./src/config/db');

async function migrate() {
    try {
        console.log("🚀 Starting database migration...");

        // 1. Add columns to user_addresses
        await pool.query(`
            ALTER TABLE user_addresses 
            ADD COLUMN IF NOT EXISTS house_no VARCHAR(100),
            ADD COLUMN IF NOT EXISTS area VARCHAR(100),
            ADD COLUMN IF NOT EXISTS pincode VARCHAR(10),
            ADD COLUMN IF NOT EXISTS landmark TEXT;
        `);
        console.log("✅ Enhanced user_addresses table.");

        // 2. Add address to profiles (if missed)
        await pool.query(`
            ALTER TABLE profiles 
            ADD COLUMN IF NOT EXISTS address TEXT;
        `);
        console.log("✅ Ensured address column in profiles.");

        // 3. Remove duplicate pickups (Strict check)
        // Groups by user, items, slot, and day, then keeps only the earliest one.
        await pool.query(`
            DELETE FROM pickups 
            WHERE id IN (
                SELECT id FROM (
                    SELECT id, 
                           ROW_NUMBER() OVER(PARTITION BY user_id, items, time_slot, (created_at::date) ORDER BY created_at ASC) as row_num
                    FROM pickups
                    WHERE status = 'scheduled'
                ) t 
                WHERE t.row_num > 1
            );
        `);
        console.log("✅ Cleaned up duplicate orders.");

        console.log("🏁 Migration completed successfully!");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrate();
