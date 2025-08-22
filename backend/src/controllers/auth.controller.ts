import { NextFunction, Request, Response } from 'express';
import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
import User from '../models/user.model';
import crypto from 'crypto';

import type { Types } from 'mongoose';
import type { StringValue } from 'ms';
import type { UserType } from '../models/user.model';
import Email from '../utils/sendEmail';

type cookieOptionsType = {
    httpOnly: boolean;
    expires: Date;
    secure?: boolean;
};
const signToken = (id: Types.ObjectId) => {
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
const forgotPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const email = req.body.email;
        if (!email)
            return next(new AppError('Please provide a valid email id', 400));
        const user = await User.findOne({ email }).select('+password');
        if (!user)
            return next(
                new AppError('No such user with that email exists', 400)
            );
        const resetToken = user.createPasswordResetToken();
        await user.save({ validateBeforeSave: false });

        const url = `${req.protocol}//${req.host}/api/v1/auth/resetPassword/${resetToken}`;
        try {
            await new Email(
                {
                    userName: user.name,
                    email: user.email,
                },
                url
            ).sendResetLink();
            return res.status(200).json({
                status: 'success',
                data: {
                    message: 'Mail sent successfully',
                },
            });
        } catch (err) {
            console.log(err);
            user.resetPasswordToken = undefined;
            user.resetTokenExpireTime = undefined;
            await user.save({ validateBeforeSave: false });

            return res.status(500).json({
                status: 'fail',
                data: {
                    message: 'Error updating the password',
                },
            });
        }
    }
);
const resetPassword = catchAsync(
    async (req: Request, res: Response, next: NextFunction) => {
        const password = req.body.password;
        const confirmPassword = req.body.confirmPassword;
        const resetToken = req.params.resetToken;

        if (!password || !confirmPassword)
            return next(new AppError('Password is required', 400));

        const hashedToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetTokenExpireTime: { $gte: Date.now() },
        });

        if (!user) return next(new AppError('Invalid token', 400));

        user.password = password;
        user.confirmPassword = confirmPassword;
        user.resetTokenExpireTime = undefined;
        user.resetPasswordToken = undefined;

        await user.save();
        return res.status(200).json({
            status: 'success',
            data: {
                message: 'Password updated successfully',
            },
        });
    }
);
export { login, signup, forgotPassword, resetPassword };
