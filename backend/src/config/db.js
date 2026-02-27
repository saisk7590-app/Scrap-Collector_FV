const { Pool } = require("pg");
const env = require("./env");

const poolConfig = env.DATABASE_URL
  ? { connectionString: env.DATABASE_URL }
  : {
    user: env.DB_USER,
    host: env.DB_HOST,
    database: env.DB_NAME,
    password: env.DB_PASSWORD,
    port: parseInt(env.DB_PORT),
  };

const pool = new Pool(poolConfig);

pool.on("connect", () => {
  // Silent in production, or use a logger
  if (env.NODE_ENV === 'development') {
    console.log("✅ PostgreSQL connected");
  }
});

pool.on("error", (err) => {
  console.error("❌ PostgreSQL pool error:", err.message);
});

module.exports = pool;
