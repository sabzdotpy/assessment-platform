import { HTTP_STATUS } from "../constants/enum/responseCodes.enum.js";

class Response {

    /**
     * success response
     * @param {Object} res - Express response object
     * @param {Number} status - HTTP status code, int, enum of HTTP_STATUS
     * @param {String} message - Success message
     * @param {Object} data - Response data
     */
    static success(res, status = HTTP_STATUS.OK, message = "", data = null) {
        return res.status(status).json({
            success: true,
            message: message.trim(),
            data,
            error: null
        });
    }

    /**
     * error response
     * @param {Object} res - Express response object 
     * @param {Number} status - HTTP status code, int, enum of HTTP_STATUS
     * @param {String} message - Error message
     * @param {Object} error - Error details
     */
    static error(res, status = HTTP_STATUS.INTERNAL_ERROR, message = "Internal server error", error = null) {
        console.log(`--- Encountered error in route ${res.req.originalUrl} ---`);
        console.error(`[${new Date().toLocaleString()}] [${status}] ${message}`, error || "No error object provided");
        console.log(`------`);

        return res.status(status).json({
            success: false,
            message: message.trim(),
            data: null,
            error: (process.env.NODE_ENV === 'production') ? (error?.message || "") : (error?.stack || error || "No error object provided")
        });
    }

}

export default Response;