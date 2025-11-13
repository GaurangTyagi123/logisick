import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import User from '../models/user.model';
import jwt from 'jsonwebtoken';
import '../utils/oauth.setup';

import type { StringValue } from 'ms';

/**
 * @brief Functiont to handle user signup by oAuth via google
 * @params req(Express Request) res(Express Response) next(Express Next Function)
 * @request user(UserType)
 * @approach if the request contains user data then generate json-webtoken from the user-id and redirect the request to frontend of the application
 * @sideEffect user is signed up or signed in
 */
const googleSignup = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        if (!req.user) return next(new AppError('There was an error', 400));
        const user = req.user as UserType;
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SIGN as string,
            {
                expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME as StringValue,
            }
        );
        await User.findByIdAndUpdate(req.user._id, { refreshToken: token });
        const cookieOptions: cookieOptionsType = {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge:
                parseInt(process.env.COOKIE_EXPIRE_TIME as string) *
                24 *
                60 *
                60 *
                1000,
        };
        res.cookie('jwt', token, cookieOptions);
        console.log(token);
        res.redirect(process.env.FRONTEND_URL as string);
    }
);
export default googleSignup;
