import { NODE_ENV } from "../config/env";

const errorMiddleware = (err, req, res, next) => {
    try{
        let error = { ...err };
        error.message = err.message;

        console.log(err);

        if(err.name === 'CastError'){
            const message = 'Resource not found';
            error = new Error(message);
            error.statusCode = 404;
        }

        if(err.name === 'ValidationError'){
            const message = 'Invalid input data';
            error = new Error(message);
            error.statusCode = 400;
        }

        if(err.name === 'JsonWebTokenError'){
            const message = 'Invalid token';
            error = new Error(message);
            error.statusCode = 401;
        }

        if(err.code === 11000){
            const message = 'Duplicate field value entered';
            error = new Error(message);
            error.statusCode = 409;
        }

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || 'Server Error',
            stack: NODE_ENV === 'production' ? null : err.stack
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Internal Server Error',
            stack: NODE_ENV === 'production' ? null : error.stack
        });
        
    }
}
export default errorMiddleware;