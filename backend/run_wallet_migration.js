const pool = require('./src/config/db');
const fs = require('fs');
const path = require('path');

async function runMigration() {
    const migrationPath = path.join(__dirname, 'src', 'migrations', '006_finalize_wallet_system.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    const client = await pool.connect();
    try {
        console.log("🚀 Starting database migration: Finalize Wallet System...");
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log("✅ Migration completed successfully!");
    } catch (err) {
        await client.query('ROLLBACK');
        console.error("❌ Migration failed:", err);
    } finally {
        client.release();
        process.exit();
    }
}

runMigration();
