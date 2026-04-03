const pool = require('./src/config/db');

async function checkGov() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'government_sectors'");
    console.log('gov:', res.rows.map(r => r.column_name));
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkGov();
