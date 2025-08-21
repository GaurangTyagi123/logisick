import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';

import type { ObjectId } from 'mongoose';
import type { StringValue } from 'ms';
import User, { type UserType } from '../models/userModel';

type cookieOptionsType = {
    httpOnly: boolean;
    expires: Date;
    secure?: boolean;
};
const signToken = (id: ObjectId) => {
    const JWTSign = process.env.JWT_SIGN as string;
    const JWTExpire = process.env.JWT_EXPIRE_TIME as StringValue;
    return jwt.sign({ id }, JWTSign, { expiresIn: JWTExpire });
};
const sendNewToken = (user: UserType, res: Response, statusCode: number) => {
    const token = signToken(user._id);
    const cookieOptions: cookieOptionsType = {
        httpOnly: true,
        expires: new Date(
            Date.now() +
                parseInt(process.env.COOKIE_EXPIRE_TIME as string) *
                    24 *
                    60 *
                    60 *
                    1000
        ),
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
    }
    return res.status(statusCode).json({
        token,
        user,
    });
};
const login = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        if (!email || !password)
            return next(
                new AppError('Please provide a valid email and password', 400)
            );
        const user = await User.findOne({ email });
        if (!user || !user.comparePasswords(password, user.password))
            return next(new AppError('No such user exists', 401));
        sendNewToken(user, res, 200);
    }
);
const signup = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword)
            return next(new AppError('Please provide valid details', 400));
        const newUser = await User.create({
            name,
            email,
            password,
            confirmPassword,
        });
        if (!newUser) return next(new AppError('Failed to signup', 500));
        sendNewToken(newUser, res, 201);
    }
);
export { login, signup };
