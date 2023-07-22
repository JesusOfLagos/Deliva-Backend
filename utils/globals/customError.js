//Error Class
export default class AppError extends Error {
    constructor(message, statusCode) {
        
        // check if what is passed is an object or string
        if (typeof message === 'object') {
            super(Object.values(message));
            this.field = Object.keys(message).toString();
        } else{
            super(message);

        }
        this.statusCode = statusCode;
        this.status = statusCode < 500 ? "error" : "fail";

        Error.captureStackTrace(this, this.constructor);
    }
};

// Error Handler
