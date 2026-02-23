const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "scrap_collector",
    password: process.env.DB_PASSWORD || "admin123",
    port: parseInt(process.env.DB_PORT) || 5432,
});

async function resetPassword() {
    try {
        const email = "1234567890@scrapcollector.in";
        const password = "password123";

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Update user
        await pool.query(
            "UPDATE users SET password_hash = $1 WHERE email = $2",
            [passwordHash, email]
        );

        console.log("✅ Password reset for: 1234567890@scrapcollector.in / password123");
    } catch (err) {
        console.error("Error resetting password:", err.message);
    } finally {
        await pool.end();
    }
}

resetPassword();
