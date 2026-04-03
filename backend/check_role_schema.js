const pool = require('./src/config/db');

async function checkSchema() {
  try {
    const govResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'government_sectors'
    `);
    console.log('government_sectors columns:', govResult.rows);

    const communityResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'gated_communities'
    `);
    console.log('gated_communities columns:', communityResult.rows);

    const corporateResult = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'corporates'
    `);
    console.log('corporates columns:', corporateResult.rows);

  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

checkSchema();
