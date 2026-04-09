require('dotenv').config();
const pool = require('./src/config/db');

async function fixLedger() {
    try {
        const client = await pool.connect();
        
        // 1. Get the current actual balance of user 11
        const balRes = await client.query('SELECT wallet_balance FROM profiles WHERE user_id = 11');
        if (balRes.rows.length === 0) {
            console.log("User 11 not found in profiles.");
            return;
        }
        const currentBalance = balRes.rows[0].wallet_balance;
        
        // 2. Insert the missing 200 credit in collector transactions
        await client.query(`
            INSERT INTO collector_wallet_transactions (collector_id, amount, type, description, balance_after)
            VALUES (11, 200.00, 'CREDIT', 'Manual Admin Top-up', $1)
        `, [currentBalance]);
        
        console.log("Successfully inserted missing 200 CREDIT transaction for user 11 with balance_after:", currentBalance);
        
        client.release();
    } catch (err) {
        console.error("DB error:", err);
    } finally {
        pool.end();
    }
}

fixLedger();
