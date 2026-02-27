const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const env = require("./src/config/env");
const routes = require("./src/routes");
const errorMiddleware = require("./src/middlewares/errorMiddleware");
const pool = require("./src/config/db");

const app = express();

// ✅ SECURITY HEADERS
app.use(helmet());

// ✅ RATE LIMITING
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use("/api/", limiter);

// ✅ CORS CONFIGURATION
const corsOptions = {
  origin: "*", // For development. Specify domains in production.
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// ✅ PARSE JSON
app.use(express.json());

// ✅ ROUTES
app.use("/api", routes);

// ✅ GLOBAL ERROR HANDLER
app.use(errorMiddleware);

const PORT = env.PORT;

const startServer = async () => {
  try {
    // Test DB connection
    const client = await pool.connect();
    console.log("✅ PostgreSQL connected successfully");
    client.release();

    app.listen(PORT, () => {
      console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
      console.log(`📡 API Base: http://localhost:${PORT}/api`);
    });
  } catch (err) {
    console.error("❌ Failed to connect to PostgreSQL:", err.message);
    process.exit(1);
  }
};

startServer();
