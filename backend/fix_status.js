const pool = require('./src/config/db');

async function fix() {
    try {
        const res = await pool.query("UPDATE pickups SET status = 'scheduled', collector_id = NULL WHERE id = 3");
        console.log('Update complete. Rows affected:', res.rowCount);
        
        const check = await pool.query("SELECT id, status FROM pickups WHERE id = 3");
        console.log('Verification:', check.rows[0]);
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        process.exit();
    }
}

fix();
