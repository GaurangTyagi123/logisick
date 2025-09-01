// application's error handler
class AppError extends Error {
    private statusCode: number;
    private isOperational: boolean;

    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true; // this indicates the application(server) has handled the error

        Error.captureStackTrace(this, this.constructor); //captures the error stack excluding this error and appends it to the instance of this error class
    }
}
export default AppError;
