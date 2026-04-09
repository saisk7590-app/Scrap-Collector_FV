const { Pool } = require('pg');
const p = new Pool({ user: 'postgres', host: 'localhost', database: 'scrap_collector', password: 'admin123', port: 5432 });

async function main() {
  // List all tables
  const tables = await p.query(`SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name`);
  console.log('TABLES:', tables.rows.map(x => x.table_name).join(', '));

  // Check wallet_transactions table columns
  const wtCols = await p.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='customer_wallet_transactions' ORDER BY ordinal_position`);
  console.log('WALLET TX COLS:', JSON.stringify(wtCols.rows, null, 2));

  // Check profiles wallet columns
  const pwCols = await p.query(`SELECT column_name, data_type FROM information_schema.columns WHERE table_name='profiles' AND column_name LIKE '%wallet%'`);
  console.log('PROFILE WALLET COLS:', JSON.stringify(pwCols.rows, null, 2));

  // Check if user 0987654321 exists
  const user = await p.query(`SELECT u.id, u.email, p.full_name, p.phone, p.wallet_balance, r.name as role FROM users u JOIN profiles p ON u.id=p.user_id JOIN roles r ON p.role_id=r.id WHERE p.phone='0987654321' OR u.email LIKE '%0987654321%'`);
  console.log('USER:', JSON.stringify(user.rows, null, 2));

  // Check wallet transactions for this user
  if (user.rows.length > 0) {
    const txns = await p.query(`SELECT * FROM customer_wallet_transactions WHERE user_id=$1 ORDER BY created_at DESC LIMIT 10`, [user.rows[0].id]);
    console.log('TRANSACTIONS:', JSON.stringify(txns.rows, null, 2));
  }

  await p.end();
}

main().catch(e => { console.error('ERROR:', e.message); p.end(); });
