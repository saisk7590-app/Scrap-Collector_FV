/**
 * Centralized API response utility
 */
class ApiResponse {
    /**
     * @param {number} statusCode - HTTP status code
     * @param {string} message - Success or error message
     * @param {any} data - Response payload (optional)
     * @param {boolean} success - Operation status
     */
    constructor(statusCode, message, data = null, success = true) {
        this.success = success;
        this.message = message;
        this.statusCode = statusCode;
        if (data !== null) this.data = data;
    }

    static success(res, message = "Success", data = null, statusCode = 200) {
        const response = new ApiResponse(statusCode, message, data, true);
        return res.status(statusCode).json(response);
    }

    static error(res, message = "Error occurred", statusCode = 500, error = null) {
        const response = {
            success: false,
            message,
            statusCode,
            ...(error && process.env.NODE_ENV === 'development' ? { stack: error.stack } : {})
        };
        return res.status(statusCode).json(response);
    }
}

module.exports = ApiResponse;
