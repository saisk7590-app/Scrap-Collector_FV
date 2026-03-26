// Generate a concise list of all tables and their columns from the live PostgreSQL DB.
// Output: db.sql at repo root (overwrites if present).

const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function main() {
  const pool = new Pool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  const client = await pool.connect();
  try {
    const tables = await client.query(
      `
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
      `
    );

    const out = [];
    out.push(`-- Table list generated ${new Date().toISOString()}`);
    out.push(`-- Database: ${process.env.DB_NAME}`);
    out.push('');

    for (const { table_schema, table_name } of tables.rows) {
      const cols = await client.query(
        `
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
        `,
        [table_schema, table_name]
      );

      out.push(`${table_schema}.${table_name}`);
      out.push(
        cols.rows.map((c, idx) => `  ${idx + 1}. ${c.column_name}`).join('\n') ||
          '  (no columns found)'
      );
      out.push(''); // blank line between tables
    }

    const dest = path.join(__dirname, '..', '..', 'db.sql');
    fs.writeFileSync(dest, out.join('\n'), 'utf8');
    console.log(`Wrote table list to ${dest}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Failed to export table list:', err);
  process.exitCode = 1;
});
