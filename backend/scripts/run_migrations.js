require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../src/config/db');

async function runMigrations() {
    const client = await pool.connect();

    try {
        const migrationsDir = path.join(__dirname, '..', 'src', 'migrations');
        const files = fs.readdirSync(migrationsDir)
            .filter((file) => file.endsWith('.sql'))
            .filter((file) => !file.toLowerCase().includes('seed'))
            .sort();

        if (files.length === 0) {
            console.log('No SQL migrations found.');
            return;
        }

        await client.query('BEGIN');

        for (const file of files) {
            const fullPath = path.join(migrationsDir, file);
            const sql = fs.readFileSync(fullPath, 'utf8').trim();

            if (!sql) {
                continue;
            }

            console.log(`Running migration: ${file}`);
            await client.query(sql);
        }

        await client.query('COMMIT');
        console.log('All migrations completed successfully.');
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Migration failed:', error.message);
        process.exitCode = 1;
    } finally {
        client.release();
        await pool.end();
    }
}

runMigrations();
