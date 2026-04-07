const pool = require('./src/config/db');

async function verifyWallet() {
    const query = `
    SELECT 
      user_id,
      SUM(CASE WHEN type = 'CREDIT' THEN amount ELSE -amount END) AS calculated_balance,
      MAX(balance_after) AS last_balance,
      (SELECT wallet_balance FROM profiles WHERE profiles.user_id = wallet_transactions.user_id) AS actual_balance
    FROM wallet_transactions
    GROUP BY user_id;
    `;

    try {
        console.log("🔍 Running Wallet Consistency Check...");
        const result = await pool.query(query);
        
        if (result.rows.length === 0) {
            console.log("ℹ️ No transactions found to verify.");
            return;
        }

        let allConsistent = true;
        console.table(result.rows.map(row => {
            const isConsistent = Number(row.calculated_balance) === Number(row.actual_balance) && 
                                Number(row.last_balance) === Number(row.actual_balance);
            if (!isConsistent) allConsistent = false;
            
            return {
                ...row,
                Consistent: isConsistent ? '✅' : '❌'
            };
        }));

        if (allConsistent) {
            console.log("✅ ALL WALLETS ARE CONSISTENT!");
        } else {
            console.error("❌ INCONSISTENCY DETECTED IN ONE OR MORE WALLETS!");
        }
    } catch (err) {
        console.error("❌ Verification failed:", err);
    } finally {
        process.exit();
    }
}

verifyWallet();
