const ApiResponse = require('../utils/apiResponse');

/**
 * Global error handling middleware
 */
const errorMiddleware = (err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.url}`, err);

    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal Server Error";

    // Handle specific DB or JWT errors if needed
    if (err.code === '23505') { // Postgres unique violation
        statusCode = 409;
        message = "Duplicate record found";
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = "Invalid token. Please log in again.";
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = "Session expired. Please log in again.";
    }

    ApiResponse.error(res, message, statusCode, err);
};

module.exports = errorMiddleware;
