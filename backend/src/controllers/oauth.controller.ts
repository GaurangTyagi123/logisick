import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
import '../utils/oauth.setup';

import type { StringValue } from 'ms';

/**
 * @params req(Express Request) res(Express Response) next(Express Next Function)
 * @request user(UserType)
 * @approach if the request contains user data then generate json-webtoken from the user-id and redirect the request to frontend of the application
 * @sideEffect user is signed up or signed in
 */
const googleSignup = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
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
        res.cookie('jwt', token, cookieOptions);

        res.redirect('http://localhost:5173/');
    }
);
export default googleSignup;
