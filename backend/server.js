const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ ALLOW ALL REQUESTS (CORS)
app.use(cors());

// ✅ PARSE JSON
app.use(express.json());

// ✅ ROUTES
const routes = require("./src/routes");
app.use("/api", routes);

// ✅ DB CONNECTION CHECK
const pool = require("./src/config/db");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test DB connection
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected: scrap_collector");
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
      console.log(`❤️  Health: http://localhost:${PORT}/api/health`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    console.error("💡 Make sure PostgreSQL is running and the database 'scrap_collector' exists.");
    console.error("💡 Run database_schema.sql to create tables.");
    process.exit(1);
  }
};

startServer();
