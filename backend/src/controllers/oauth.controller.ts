import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
import '../utils/oauth.setup';
import { StringValue } from 'ms';

const googleSignup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user) return next(new AppError('There was an error', 400));
        const user = req.user as UserType;
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SIGN as string,
            {
                expiresIn: process.env.JWT_EXPIRE_TIME as StringValue,
            }
        );

        const cookieOptions: cookieOptionsType = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            expires: new Date(
                Date.now() +
                    parseInt(process.env.COOKIE_EXPIRE_TIME as string) *
                        24 *
                        60 *
                        60 *
                        1000
            ),
        };
        res.cookie('jwt', cookieOptions);

        // TODO: add url to frontend
        res.redirect('/');
    }
);
export default googleSignup;
