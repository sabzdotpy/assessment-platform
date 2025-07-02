import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";

class Response {

    /**
     * success response
     * @param {Object} res - Express response object
     * @param {Number} status - HTTP status code
     * @param {String} message - Success message
     * @param {Object} data - Response data
     */
    static success(res, status = HTTP_STATUS.OK, message = "", data = null) {
        return res.status(status).json({
            success: true,
            message,
            data,
            error: null
        });
    }

    /**
     * error response
     * @param {Object} res - Express response object 
     * @param {Number} status - HTTP status code
     * @param {String} message - Error message
     * @param {Object} error - Error details
     */
    static error(res, status = HTTP_STATUS.INTERNAL_ERROR, message = "Internal server error", error = null) {
        console.error(`[${new Date().toISOString()}] [${status}] ${message}`, error);

        return res.status(status).json({
            success: false,
            message,
            data: null,
            error: process.env.NODE_ENV === 'production' ? null : error
        });
    }

}

export default Response;