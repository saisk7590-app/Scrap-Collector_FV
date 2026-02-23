const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "scrap_collector", // 👈 changed from cafe_db
  password: "admin123",
  port: 5432,
});

pool.on("connect", () => {
  console.log("✅ PostgreSQL connected: scrap_collector");
});

module.exports = pool;
