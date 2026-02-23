const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "scrap_collector",
    password: process.env.DB_PASSWORD || "admin123",
    port: parseInt(process.env.DB_PORT) || 5432,
});

async function checkUsers() {
    try {
        const res = await pool.query("SELECT email FROM users LIMIT 10");
        console.log("Users in DB:", res.rows);
    } catch (err) {
        console.error("Error querying DB:", err.message);
    } finally {
        await pool.end();
    }
}

checkUsers();
