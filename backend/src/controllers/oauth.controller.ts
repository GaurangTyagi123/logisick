import catchAsync from '../utils/catchAsync';
import AppError from '../utils/appError';
import jwt from 'jsonwebtoken';
import '../utils/oauth.setup';
import User from '../models/user.model';

import type { StringValue } from 'ms';

/**
 * @brief Controller Function to handle post-Google OAuth successful authentication, generate a JWT, set it as an HTTP-only cookie, and redirect the user to the frontend URL.
 * @param {UserRequest} req
 * ```
 * {
 *      headers:{
 *          authorization:'Bearer "jwt http only cookie"'
 *      },
 *      user: { // Attached by Passport/OAuth middleware after successful authentication
 *          _id: 'user_mongo_id',
 *          ... other user details
 *      }
 * }
 * ```
 * request containing the authenticated user object.
 * @param {ExpressRexponse} res - response to set cookie and handle redirect
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect
 * - Generates a JSON Web Token (JWT) containing the user ID.
 * - Sets the JWT as an HTTP-only cookie named 'jwt' on the response object.
 * - Redirects the client to the `FRONTEND_URL` defined in environment variables.
 * @author `Gaurang Tyagi`
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
        res.redirect(process.env.FRONTEND_URL as string);
    }
);

export default googleSignup;
