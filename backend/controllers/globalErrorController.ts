import { NextFunction, Request, Response } from 'express';

export default (err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (process.env.NODE_ENV === 'development') {
        return res.status(err.statusCode).json({
            error: err,
            status: err.status,
            stack: err.stack,
            message: err.message,
        });
    } else if (process.env.NODE_ENV === 'production') {
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                message: err.message,
                status: err.status,
            });
        } else {
            console.log(err);
            return res.status(500).json({
                error: 'error',
                message: 'Something went wrong',
            });
        }
    }
};
