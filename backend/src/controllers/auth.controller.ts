import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../models/user.model';
import crypto from 'crypto';
import { promisify } from 'util';

import type { StringValue } from 'ms';
import Email from '../utils/sendEmail';
import { genProfileString } from '../utils/avatarGen';

const signToken = (id: ObjectId) => {
    const JWTSign = process.env.JWT_SIGN as string;
    const JWTExpire = process.env.JWT_EXPIRE_TIME as StringValue;
    return jwt.sign({ id }, JWTSign, { expiresIn: JWTExpire });
};

const sendNewToken = (
    user: UserType,
    res: ExpressTypes.Response,
    statusCode: number
) => {
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
    res.cookie('jwt', token, cookieOptions);

    return res.status(statusCode).json({
        token,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
        role: user.role,
        passwordUpdatedAt: user.passwordUpdatedAt,
    });
};

export const protect = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        let token: string | undefined;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            token = req.headers.authorization.split(' ').at(1);
        }
        if (req.cookies) {
            token = req.cookies?.jwt;
        }
        if (!token) return next(new AppError('Invalid Token', 401));
        const verifyAsync = promisify(jwt.verify) as (
            token: string,
            secret: string
        ) => Promise<JwtPayload>;
        const { id, iat: issuedAt } = await verifyAsync(
            token,
            process.env.JWT_SIGN as string
        );
        const user = await User.findById(id);
        if (!user || user.passwordUpdatedAfter(issuedAt as number)) {
            return next(new AppError('Password updated recently', 401));
        }
        req.user = user;
        return next();
    }
);

export const login = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const { email, password } = req.body;
        if (!email || !password)
            return next(
                new AppError('Please provide a valid email and password', 400)
            );
        const user = await User.findOne({ email }).select('+password');
        if (
            !user ||
            !(await user.comparePasswords(password, user.password as string))
        )
            return next(new AppError('No such user exists', 401));

        sendNewToken(user, res, 200);
    }
);
export const logout = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        await User.findByIdAndUpdate(req.user?._id, { active: false });
        const cookieOptions: cookieOptionsType = {
            httpOnly: true,
            expires: new Date(Date.now() + 10),
        };
        res.cookie('jwt', undefined, cookieOptions);
        return res.status(204).json({
            status: 'success',
        });
    }
);
export const isLoggedIn = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        let token: string | undefined;
        if (!token)
            return res.status(401).json({
                status: 'fail',
                isLoggedIn: false,
                data: {
                    message: 'Not logged in',
                },
            });

        const verifyAsync = promisify(jwt.verify) as (
            token: string,
            secret: string
        ) => Promise<JwtPayload>;
        const { id, iat: issuedAt } = await verifyAsync(
            token,
            process.env.JWT_SIGN as string
        );
        const user = await User.findById(id);
        if (!user || user.passwordUpdatedAfter(issuedAt as number)) {
            return next(new AppError('Password updated recently', 401));
        }
        return res.status(200).json({
            status: 'success',
            isLoggedIn: true,
            data: {
                user,
            },
        });
    }
);

export const signup = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const { name, email, password, confirmPassword } = req.body;
        if (!name || !email || !password || !confirmPassword)
            return next(new AppError('Please provide valid details', 400));
        const newUser = await User.create({
            name,
            email,
            password,
            confirmPassword,
            role: 'admin',
            avatar: genProfileString(12),
        });
        if (!newUser) return next(new AppError('Failed to signup', 500));
        sendNewToken(newUser, res, 201);
    }
);

export const verifyEmail = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const userOtp = req?.body?.otp;
        const isVerified = req.user?.isVerified;
        const isOtpGen = req.user!.otp;
        if (isVerified)
            return res.status(200).json({
                status: 'successfull',
                data: {
                    message: 'Your email is already verified',
                },
            });
        else if (isOtpGen && userOtp && req.user?.otp === userOtp) {
            const user = await User.findById(req.user?._id);
            user!.isVerified = true;
            user!.otp = undefined;
            await user!.save({ validateBeforeSave: false });

            res.status(200).json({
                status: 'success',
                data: {
                    message: 'email verified successfully',
                },
            });
        } else {
            const otp = Math.floor(Math.random() * 10000)
                .toString()
                .padEnd(4, '0');
            await User.findByIdAndUpdate(req.user?._id, { otp });
            await new Email(
                {
                    userName: req.user?.name as string,
                    email: req.user?.email as string,
                    otp,
                },
                ''
            ).sendVerification();
            res.status(200).json({
                status: 'success',
                data: {
                    message: 'otp sent successfully',
                },
            });
        }
    }
);

export const forgotPassword = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
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

export const resetPassword = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const prevPassword = req.body.password;
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
        }).select('+password');
        if (
            !user ||
            !(await user.comparePasswords(
                prevPassword,
                user.password as string
            ))
        )
            return next(new AppError('Invalid token or password', 400));

        user.password = password;
        user.confirmPassword = confirmPassword;
        user.resetTokenExpireTime = undefined;
        user.resetPasswordToken = undefined;

        await user.save();
        sendNewToken(user, res, 200);
    }
);
