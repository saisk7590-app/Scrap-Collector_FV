const { Pool } = require('pg');
const p = new Pool({ user: 'postgres', host: 'localhost', database: 'scrap_collector', password: 'admin123', port: 5432 });

async function main() {
  // Drop the trigger that creates duplicate Auto-Sync transaction entries
  await p.query('DROP TRIGGER IF EXISTS trg_wallet_balance_audit ON profiles');
  console.log('✅ Trigger dropped');

  // Delete duplicate Auto-Sync rows from customer wallet
  const custDel = await p.query("DELETE FROM customer_wallet_transactions WHERE description = 'Auto-Sync: Balance Adjustment'");
  console.log('✅ Deleted auto-sync customer rows:', custDel.rowCount);

  // Delete duplicate Auto-Sync rows from collector wallet
  const colDel = await p.query("DELETE FROM collector_wallet_transactions WHERE description = 'Auto-Sync: Balance Adjustment'");
  console.log('✅ Deleted auto-sync collector rows:', colDel.rowCount);

  // Verify what remains
  const remaining = await p.query('SELECT id, user_id, amount, type, description, created_at FROM customer_wallet_transactions ORDER BY created_at DESC LIMIT 10');
  console.log('Remaining customer wallet transactions:');
  remaining.rows.forEach(r => console.log(`  [${r.id}] ${r.type} ₹${r.amount} - "${r.description}"`));

  await p.end();
}

main().catch(e => { console.error('ERROR:', e.message); p.end(); });
