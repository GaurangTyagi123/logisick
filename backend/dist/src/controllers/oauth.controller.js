"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("../utils/oauth.setup");
const user_model_1 = __importDefault(require("../models/user.model"));
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
const googleSignup = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.user)
        return next(new appError_1.default('There was an error', 400));
    const user = req.user;
    const token = jsonwebtoken_1.default.sign({ id: user._id }, process.env.JWT_SIGN, {
        expiresIn: process.env.JWT_REFRESH_EXPIRE_TIME,
    });
    await user_model_1.default.findByIdAndUpdate(req.user._id, { refreshToken: token });
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: parseInt(process.env.COOKIE_EXPIRE_TIME) *
            24 *
            60 *
            60 *
            1000,
    };
    res.cookie('jwt', token, cookieOptions);
    res.redirect(process.env.FRONTEND_URL);
});
exports.default = googleSignup;
