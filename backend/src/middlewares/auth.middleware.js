const jwt = require('jsonwebtoken');
const env = require('../config/env');

/**
 * Authentication Middleware
 * Verifies JWT token from the Authorization header
 * and attaches the user object to the request.
 */
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        const err = new Error('Authentication required');
        err.statusCode = 401;
        return next(err);
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, env.JWT_SECRET);

        // Attach user info to request
        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role,
        };

        next();
    } catch (err) {
        // Pass to central error handler
        next(err);
    }
};

module.exports = authMiddleware;
