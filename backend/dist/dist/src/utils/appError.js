"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Application's error handler
class AppError extends Error {
    statusCode;
    isOperational;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // this indicates the application(server) has handled the error
        Error.captureStackTrace(this, this.constructor); //captures the error stack excluding this error and appends it to the instance of this error class
    }
}
exports.default = AppError;
