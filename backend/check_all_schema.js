const pool = require('./src/config/db');

async function checkAllSchema() {
  try {
    const roles = ['government_sectors', 'gated_communities', 'corporates'];
    for (const role of roles) {
      const res = await pool.query(`SELECT column_name FROM information_schema.columns WHERE table_name = '${role}'`);
      console.log(`${role}:`, res.rows.map(r => r.column_name).join(', '));
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkAllSchema();
