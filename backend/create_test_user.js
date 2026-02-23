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

async function createTestUser() {
    try {
        const email = "test@test.com";
        const password = "password123";
        const fullName = "Test User";
        const phone = "1234567890";
        const role = "customer";

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const passwordHash = await bcrypt.hash(password, salt);

        // Insert user
        const userResult = await pool.query(
            "INSERT INTO users (email, password_hash) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash RETURNING id",
            [email, passwordHash]
        );

        const userId = userResult.rows[0].id;

        // Insert profile
        await pool.query(
            "INSERT INTO profiles (user_id, full_name, phone, role) VALUES ($1, $2, $3, $4) ON CONFLICT (user_id) DO UPDATE SET full_name = EXCLUDED.full_name, phone = EXCLUDED.phone, role = EXCLUDED.role",
            [userId, fullName, phone, role]
        );

        console.log("✅ Test user created/updated: test@test.com / password123");
    } catch (err) {
        console.error("Error creating test user:", err.message);
    } finally {
        await pool.end();
    }
}

createTestUser();
