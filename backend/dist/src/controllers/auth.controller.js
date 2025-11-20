"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.signup = exports.isEmployee = exports.isLoggedIn = exports.logout = exports.login = exports.refresh = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const avatarGen_1 = require("../utils/avatarGen");
const util_1 = require("util");
const crypto_1 = __importDefault(require("crypto"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//I MODELS
const employee_model_1 = __importDefault(require("../models/employee.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
//I TYPES
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("../app");
/**
 * @brief function to create jwt token of given user id
 * @param {ObjectId} id - id of user
 * @param {boolean } access? - to specify weather to use access token expire time or not
 * @returns {string} jwt token
 * @author `Gaurang Tyagi`
 */
const signToken = (id, access = false) => {
    const JWTSign = process.env.JWT_SIGN;
    const JWTExpire = access
        ? process.env.JWT_ACCESS_EXPIRE_TIME
        : process.env.JWT_REFRESH_EXPIRE_TIME;
    return jsonwebtoken_1.default.sign({ id }, JWTSign, { expiresIn: JWTExpire });
};
/**
 * @brief To send the generated json-webtoken with the response header
 * @param {UserType} user - user mongoose object
 * @param {ExpressResponseobject} res - express response to add response
 * @param {number} statusCode - status code of response
 * @returns {JSON} response -
 * ```
 *      {
 *          status: "success",
 *          data: {
 *              user: {
 *                  _id: stinrg,
 *                  name: stinrg,
 *                  email: stinrg,
 *                  isVerified: user.isVerified,
 *                  avatar: stinrg,
 *                  createdAt: date,
 *                  updatedAt: datet,
 * 				}
 * 			}
 *      }
 * ```
 * @author `Gaurang Tyagi`
 */
const sendNewToken = async (user, res, statusCode) => {
    const refreshToken = signToken(user._id);
    const accessToken = signToken(user._id, true);
    await user_model_1.default.findByIdAndUpdate(user._id, { refreshToken });
    const cookieOptions = {
        httpOnly: true,
        maxAge: parseInt(process.env.COOKIE_EXPIRE_TIME) *
            24 *
            60 *
            60 *
            1000,
        secure: process.env.NODE_ENV === 'production',
    };
    res.cookie("jwt", refreshToken, cookieOptions);
    return res.status(statusCode).json({
        status: "success",
        refreshToken,
        accessToken,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                myOrg: user.myOrg,
            },
        },
    });
};
/**
 * @brief function to regenerate refresh token for loggedin users
 * @param {ExpressTypes.UserRequest} req - `{cookies:{token:string}}` - request with cookies containing jwt token
 * @param {ExpressTypes.Response} res
 * @param {ExpressTypes.NextFn} next
 * @return {json} ```
 *  {
 *		status: 'success',
 *		data: {
 *			accessToken,
 *		},
 *	}
 *	```
 * @author `Gaurang Tyagi`
 */
exports.refresh = (0, catchAsync_1.default)(async (req, res, next) => {
    let token;
    if (req.cookies) {
        token = req.cookies?.jwt;
    }
    if (!token)
        return next(new appError_1.default("Invalid Token please login again", 403));
    const verifyAsync = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
    let jt;
    try {
        jt = await verifyAsync(token, process.env.JWT_SIGN);
    }
    catch {
        res.clearCookie("jwt");
        return next(new appError_1.default("Session expired", 403));
    }
    const id = jt?.id;
    const issuedAt = jt?.iat;
    const user = await user_model_1.default.findOne({ _id: id, refreshToken: token });
    if (!user) {
        res.clearCookie("jwt");
        return next(new appError_1.default("Session expired... Please login again", 403));
    }
    if (user.passwordUpdatedAfter(issuedAt))
        return next(new appError_1.default("Password updated recently", 403));
    const accessToken = signToken(user._id, true);
    return res.status(200).json({
        status: "success",
        data: {
            accessToken,
        },
    });
});
/**
 * @brief Function to login existing users
 * @param {UserRequest} req
 * ```
 * {
 * 		body: {
 * 			email:string,
 * 			pasword:string
 * 		}
 * }
 * ```
 * request with email and password
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @author `Gaurang Tyagi`
 */
exports.login = (0, catchAsync_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password)
        return next(new appError_1.default("Please provide a valid email and password", 400));
    const user = await user_model_1.default.findOne({ email }).select("+password");
    // comparePasswords compares the password entered by the user and the password stored in the database
    if (!user ||
        !(await user.comparePasswords(password, user.password)))
        return next(new appError_1.default("No such user exists", 401));
    await sendNewToken(user, res, 200);
});
/**
 * @brief Function to logout signed in users
 * @param {UserRequest} req - request
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @author `Gaurang Tyagi`
 */
exports.logout = (0, catchAsync_1.default)(async (_req, res, _next) => {
    res.clearCookie("jwt");
    return res.status(200).json({
        status: "success",
    });
});
/**
 * @brief Function to check authentication of a user
 * @param {UserRequest} req - `{cookies: {jwt: "jwt token"}}` - request
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return {json}
 * ```
 * {
 *			status: "success",
 *			isLoggedIn: true,
 *			data: {
 *				user: {
 *					_id: user _id,
 *					name: user name,
 *					email: user email,
 *					isVerified: user isVerified,
 *					avatar: user avatar,
 *					createdAt: user createdAt,
 *					updatedAt: user updatedAt,
 *					myOrg: user myOrg,
 *				},
 *			},
 *		}
 * ```
 * @author `Gaurang Tyagi`
 */
exports.isLoggedIn = (0, catchAsync_1.default)(async (req, res, _next) => {
    let token;
    if (req.cookies)
        token = req.cookies?.jwt;
    if (!token)
        return res.status(200).json({
            status: "fail",
            isLoggedIn: false,
            data: {
                message: "Invalid token",
            },
        });
    const verifyAsync = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
    const jt = await verifyAsync(token, process.env.JWT_SIGN);
    const id = jt?.id;
    const issuedAt = jt?.iat;
    const user = await user_model_1.default.findOne({ _id: id });
    if (!user) {
        return res.status(401).json({
            status: "fail",
            isLoggedIn: false,
            data: {
                message: "Unauthenticated",
            },
        });
    }
    if (user.passwordUpdatedAfter(issuedAt)) {
        return res.status(200).json({
            status: "fail",
            isLoggedIn: false,
            data: {
                message: "password was updated recently",
            },
        });
    }
    return res.status(200).json({
        status: "success",
        isLoggedIn: true,
        data: {
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                isVerified: user.isVerified,
                avatar: user.avatar,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
                myOrg: user.myOrg,
            },
        },
    });
});
exports.isEmployee = (0, catchAsync_1.default)(async (req, res, _next) => {
    let token;
    if (req.cookies)
        token = req.cookies?.jwt;
    if (!token)
        return res.status(200).json({
            status: "success",
            isEmployee: false,
        });
    const verifyAsync = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
    const jt = await verifyAsync(token, process.env.JWT_SIGN);
    const id = jt?.id;
    const { orgSlug } = req.params || "";
    const employee = await employee_model_1.default.find({ userid: id }).populate({
        path: "orgid",
        match: { slug: orgSlug }
    });
    if (!employee) {
        return res.status(200).json({
            status: "success",
            isEmployee: false,
            data: {
                message: "Unauthenticated",
            },
        });
    }
    return res.status(200).json({
        status: "success",
        isEmployee: true,
    });
});
/**
 * @brief Function to handle a new user signup/registration.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 * 		body: {
 * 			name: "user name",
 * 			email: "user@example.com",
 * 			password: "password123",
 * 			confirmPassword: "password123"
 * 		}
 * }
 * ```
 * request containing user details.
 * @param {ExpressTypes.Response} res - response object to set and return response to.
 * @param {ExpressTypes.NextFn} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 * 		status: "success",
 * 		token: "jwt token",
 * 		data: {
 * 			user: {
 * 				_id: user _id,
 * 				name: user name,
 * 				email: user email,
 * 				isVerified: user isVerified,
 * 				avatar: user avatar,
 * 				createdAt: user createdAt,
 * 				updatedAt: user updatedAt,
 * 			},
 * 		},
 * }
 * ```
 * @author `Gaurang Tyagi`
 */
exports.signup = (0, catchAsync_1.default)(async (req, res, next) => {
    const { name, email, password, confirmPassword } = req.body;
    if (!name ||
        !email ||
        !password ||
        !confirmPassword ||
        password !== confirmPassword)
        return next(new appError_1.default("Please provide valid details", 400));
    const newUser = await user_model_1.default.create({
        name,
        email,
        password,
        confirmPassword,
        avatar: (0, avatarGen_1.genProfileString)(12),
    });
    if (!newUser)
        return next(new appError_1.default("Failed to signup", 500));
    await sendNewToken(newUser, res, 201);
});
/**
 * @brief Function to verify a user's email address using a One-Time Password (OTP) or to send a new OTP if needed.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 * 		user: UserObject,
 * 		body: {
 * 			otp: "1234"
 * 		}
 * }
 * ```
 * request containing the authenticated user object and potentially the user-submitted OTP.
 * @param {ExpressTypes.Response} res - response object to set and return response to.
 * @param {ExpressTypes.NextFn} next - next function to pass control to error handler.
 * @return {json}
 * ```
 *  {
 * 		status: "success",
 * 		data: {
 * 			message: "Your email is already verified" | "email verified successfully" | "otp sent successfully",
 * 		},
 * 	}
 * ```
 * @author `Garang Tyagi`
 */
exports.verifyEmail = (0, catchAsync_1.default)(async (req, res, next) => {
    const userOtp = req?.body?.otp;
    const isVerified = req.user?.isVerified;
    // const isOtpGen = req.user!.otp;
    const isOtpGen = await app_1.redisClient.hGet(req.user?.id, "otp");
    if (isVerified)
        return res.status(200).json({
            status: "success",
            data: {
                message: "Your email is already verified",
            },
        });
    else if (isOtpGen && userOtp) {
        // Find a user which has the same otp and the otp's expire time is greater than the current time
        const user = await user_model_1.default.findById(req.user?.id);
        const storedOtp = await app_1.redisClient.hGet(user?.id, "otp");
        if (!user ||
            !(await bcryptjs_1.default.compare(userOtp, storedOtp))) {
            return next(new appError_1.default("Invalid OTP", 400));
        }
        user.isVerified = true;
        await user.save({ validateBeforeSave: false });
        res.status(200).json({
            status: "success",
            data: {
                message: "email verified successfully",
            },
        });
    }
    else {
        const otp = Math.floor(Math.random() * 10000)
            .toString()
            .padEnd(4, "0");
        const hashedOTP = await bcryptjs_1.default.hash(otp, 12);
        await app_1.redisClient.hSet(req.user?.id, {
            otp: hashedOTP,
        });
        const expireResult = await app_1.redisClient.expire(req.user?.id, parseInt(process.env.OTP_EXPIRE_TIME) * 60 * 1000);
        if (expireResult !== 1) {
            console.log(`Failed to set TTL for hash '${req.user?.id}'.`);
        }
        await new sendEmail_1.default({
            userName: req.user?.name,
            email: req.user?.email,
            otp,
        }, "").sendVerification();
        res.status(200).json({
            status: "success",
            data: {
                message: "otp sent successfully",
            },
        });
    }
});
/**
 * @brief Function to handle the forgotten password process by sending a password reset link to the user's email.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 * 		body: {
 * 			email: "user@example.com"
 * 		}
 * }
 * ```
 * request containing the email address of the user.
 * @param {ExpressTypes.Response} res - response object to set and return response to.
 * @param {ExpressTypes.NextFn} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 * 		status: "success",
 * 		data: {
 * 			message: "Mail sent successfully",
 *		},
 * }
 * ```
 * @author `Gaurang Tyagi`
 */
exports.forgotPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const email = req.body.email;
    if (!email)
        return next(new appError_1.default("Please provide a valid email id", 400));
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user)
        return next(new appError_1.default("No such user with that email exists", 400));
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
    try {
        await new sendEmail_1.default({
            userName: user.name,
            email: user.email,
        }, url).sendResetLink();
        return res.status(200).json({
            status: "success",
            data: {
                message: "Mail sent successfully",
            },
        });
    }
    catch (err) {
        console.log(err);
        user.resetPasswordToken = undefined;
        user.resetTokenExpireTime = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({
            status: "fail",
            data: {
                message: "Error updating the password",
            },
        });
    }
});
/**
 * @brief Function to reset a user's password using a valid reset token.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 * 		body: {
 * 			password: "newPassword123",
 * 			confirmPassword: "newPassword123"
 * 		},
 * 		params: {
 * 			resetToken: "token"
 * 		}
 * }
 * ```
 * request containing new password details and the token from the URL.
 * @param {ExpressTypes.Response} res - response object to set and return response to.
 * @param {ExpressTypes.NextFn} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 * 		status: "success",
 * 		token: "new jwt token",
 * 		data: {
 * 			user: {
 * 				...userdata
 * 			},
 * 		},
 * }
 * ```
 * @author `Gaurang Tyagi`
 */
exports.resetPassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const resetToken = req.params.resetToken;
    if (!password || !confirmPassword)
        return next(new appError_1.default("Password is required", 400));
    const hashedToken = crypto_1.default
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    const user = await user_model_1.default.findOne({
        resetPasswordToken: hashedToken,
        resetTokenExpireTime: { $gte: Date.now() },
    }).select("+password");
    if (!user)
        return next(new appError_1.default("Invalid token or password", 400));
    user.password = password;
    user.confirmPassword = confirmPassword;
    user.resetTokenExpireTime = undefined;
    user.resetPasswordToken = undefined;
    await user.save();
    await sendNewToken(user, res, 200);
});
/**
 * @brief Function for an authenticated user to change their password.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 * 		user: UserObject,
 * 		body: {
 * 			prevPassword: "oldPassword",
 * 			password: "newPassword123",
 * 			confirmPassword: "newPassword123"
 * 		}
 * }
 * ```
 * request containing the authenticated user object and new/previous password details.
 * @param {ExpressTypes.Response} res - response object to set and return response to.
 * @param {ExpressTypes.NextFn} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 * 		status: "success",
 * 		token: "new jwt token",
 * 		data: {
 * 			user: {
 * 				...userdata
 * 			},
 * 		},
 * }
 * ```
 * @author `Gaurang Tyagi`
 */
exports.updatePassword = (0, catchAsync_1.default)(async (req, res, next) => {
    const prevPassword = req.body.prevPassword;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    if (!password || !confirmPassword || !prevPassword)
        return next(new appError_1.default("Please provide a valid password", 400));
    const user = await user_model_1.default.findById(req.user?._id).select("+password");
    if (!user ||
        !(await user.comparePasswords(prevPassword, user.password))) {
        return next(new appError_1.default("Incorrect previous password", 400));
    }
    user.password = password;
    user.confirmPassword = confirmPassword;
    await user.save();
    user.password = undefined;
    await sendNewToken(user, res, 200);
});
