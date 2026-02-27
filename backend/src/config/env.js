require('dotenv').config();

const env = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    JWT_SECRET: process.env.JWT_SECRET,
    // Database
    DB_USER: process.env.DB_USER,
    DB_HOST: process.env.DB_HOST,
    DB_NAME: process.env.DB_NAME,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_PORT: process.env.DB_PORT || 5432,
    DATABASE_URL: process.env.DATABASE_URL, // Optional: if provided, it takes precedence in some setups
};

// Validate critical variables
const requiredVars = ['JWT_SECRET'];
if (!env.DATABASE_URL && !env.DB_NAME) {
    requiredVars.push('DB_NAME', 'DB_HOST', 'DB_USER');
}

requiredVars.forEach(v => {
    if (!process.env[v] && !env[v]) {
        console.error(`🚨 FATAL: Missing environment variable ${v}`);
        process.exit(1);
    }
});

module.exports = env;
