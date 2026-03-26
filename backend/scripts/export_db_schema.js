// Export a snapshot of the live PostgreSQL schema (tables + columns)
// Uses credentials from backend/.env

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
    const tablesRes = await client.query(
      `
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type = 'BASE TABLE'
        AND table_schema NOT IN ('pg_catalog', 'information_schema')
      ORDER BY table_schema, table_name;
      `
    );

    const lines = [];
    const now = new Date().toISOString();
    lines.push(`-- Database schema snapshot generated at ${now}`);
    lines.push(`-- Database: ${process.env.DB_NAME}`);
    lines.push('');

    for (const row of tablesRes.rows) {
      const { table_schema, table_name } = row;
      lines.push(`-- ${table_schema}.${table_name}`);

      const colsRes = await client.query(
        `
        SELECT
          column_name,
          data_type,
          is_nullable,
          column_default,
          character_maximum_length,
          numeric_precision,
          numeric_scale
        FROM information_schema.columns
        WHERE table_schema = $1 AND table_name = $2
        ORDER BY ordinal_position;
        `,
        [table_schema, table_name]
      );

      lines.push(`CREATE TABLE ${table_schema}.${table_name} (`);
      const colLines = colsRes.rows.map((col) => {
        const parts = [];
        parts.push(`  ${col.column_name}`);

        // Build the type with length/precision only where it makes sense
        let type = col.data_type;
        const lowerType = col.data_type.toLowerCase();
        if (col.character_maximum_length && lowerType.includes('char')) {
          type += `(${col.character_maximum_length})`;
        } else if (
          (lowerType === 'numeric' || lowerType === 'decimal') &&
          col.numeric_precision
        ) {
          const scale = col.numeric_scale !== null ? `,${col.numeric_scale}` : '';
          type += `(${col.numeric_precision}${scale})`;
        }
        parts.push(type);

        parts.push(col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL');

        if (col.column_default) {
          parts.push(`DEFAULT ${col.column_default}`);
        }

        return parts.join(' ');
      });

      lines.push(colLines.join(',\n'));
      lines.push(');');
      lines.push('');
    }

    const outPath = path.join(__dirname, '..', 'database_schema_from_db.sql');
    fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
    console.log(`Schema written to ${outPath}`);
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Failed to export schema:', err);
  process.exitCode = 1;
});
