const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "scrap_collector",
  password: process.env.DB_PASSWORD || "admin123",
  port: parseInt(process.env.DB_PORT) || 5432,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected: scrap_collector");
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
});

module.exports = pool;
