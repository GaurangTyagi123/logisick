import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Email from "../utils/sendEmail";
import { genProfileString } from "../utils/avatarGen";

import { promisify } from "util";
import crypto from "crypto";
import bcrypt from "bcryptjs";

//I MODELS
import Employee from "../models/employee.model";
import User from "../models/user.model";

//I TYPES
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { redisClient } from "../app";
import { RequestHandler } from "express";

/**
 * @brief function to create jwt token of given user id
 * @param {ObjectId} id - id of user
 * @param {boolean } access? - to specify weather to use access token expire time or not
 * @returns {string} jwt token
 * @author `Gaurang Tyagi`
 */
const signToken = (id: ObjectId, access: boolean = false) => {
	const JWTSign = process.env.JWT_SIGN as string;
	const JWTExpire = access
		? (process.env.JWT_ACCESS_EXPIRE_TIME as StringValue)
		: (process.env.JWT_REFRESH_EXPIRE_TIME as StringValue);
	return jwt.sign({ id }, JWTSign, { expiresIn: JWTExpire });
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
const sendNewToken = async (
	user: UserType,
	res: ExpressTypes.Response,
	statusCode: number
) => {
	const refreshToken = signToken(user._id);
	const accessToken = signToken(user._id, true);

    await User.findByIdAndUpdate(user._id, { refreshToken });
    const cookieOptions: cookieOptionsType = {
        httpOnly: true,
        maxAge:
            parseInt(process.env.COOKIE_EXPIRE_TIME as string) *
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
 * @approach
 * ```
 * if no cookies with jwt token => return with error code 403
 * if jwt token expired => return with error code 403
 * if password recently updated => return with error code 403
 * else return with status code 200
 * ```
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
export const refresh = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		let token: string | undefined;
		if (req.cookies) {
			token = req.cookies?.jwt;
		}
		if (!token)
			return next(new AppError("Invalid Token please login again", 403));

		const verifyAsync = promisify(jwt.verify) as (
			token: string,
			secret: string
		) => Promise<JwtPayload>;
		let jt;
		try {
			jt = await verifyAsync(token, process.env.JWT_SIGN as string);
		} catch {
			res.clearCookie("jwt");
			return next(new AppError("Session expired", 403));
		}
		const id = jt?.id;
		const issuedAt = jt?.iat;

		const user = await User.findOne({ _id: id, refreshToken: token });
		if (!user) {
			res.clearCookie("jwt");
			return next(
				new AppError("Session expired... Please login again", 403)
			);
		}

		if (user.passwordUpdatedAfter(issuedAt as number))
			return next(new AppError("Password updated recently", 403));

		const accessToken = signToken(user._id, true);
		return res.status(200).json({
			status: "success",
			data: {
				accessToken,
			},
		});
	}
);

/**
 * @brief To restrict according to the roles
 * @param {string} orgid - organization's id of which the restriction is applied for
 * @param {string} userid - user's id to which the restriction is applied
 * @param {Admin | Manager | Staff | Owner} roles Admin | Manager | Staff | Owner to allow for (comma seperated)
 * @approach
 * ```
 * if (user role in allowed) => `next function is called`
 * else 401 status returned`
 * ```
 * @return none
 * @author `Gaurang Tyagi`
 */
export const restrictTo: (...roles: string[]) => RequestHandler = (
	...roles: string[]
) => {
	return (async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { role } = (await Employee.findOne({
			userid: req.user?._id,
			orgid: req.params?.orgid,
		})) as EmpType;
		if (roles.includes(role as string)) return next();
		return next(new AppError("You are not authorized", 401));
	}) as RequestHandler;
};

/**
 * @brief Middleware Function to protect the routes from non-loggedin users
 * @param {UserRequest} req 
 * ```
 * {
 * 		headers:{
 * 			authorization:'Bearer "jwt http only cookie"'
 * 		}
 * }
 * ```
 * request with authorization token
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @approach
 * ```
 * if (the json-webtoken not in the header) => return with error code 401
 * if (no user founf with id) => return with error code 401
 * else `next function is called`
 * ```
 * @return NA
 * @sideEffect attaches user data to the request object of the subsequent middlewares
 * @author `Gaurang Tyagi`
 */
export const protect = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		_res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		let token: string | undefined;
		if (
			req.headers.authorization &&
			req.headers.authorization.startsWith("Bearer")
		) {
			token = req.headers.authorization.split(" ").at(1);
		}
		if (!token) return next(new AppError("Invalid Token", 401));
		const verifyAsync = promisify(jwt.verify) as (
			token: string,
			secret: string
		) => Promise<JwtPayload>;
		const jt = await verifyAsync(token, process.env.JWT_SIGN as string);
		const id = jt?.id;
		const issuedAt = jt?.iat;
		const user = await User.findById(id);
		if (!user) return next(new AppError("Unauthenticated", 401));

		if (user.passwordUpdatedAfter(issuedAt as number))
			return next(new AppError("Password updated recently", 401));

		req.user = user;
		return next();
	}
);

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
 * @approach
 * ```
 * if (no email or password) => return with error code 400
 * if (no user or users password don't match) =>  return with error code 401
 * else 'sendNewToken function called with user data and 200 status'
 * ```
 * @return NA
 * @author `Gaurang Tyagi`
 */
export const login = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { email, password } = req.body;
		if (!email || !password)
			return next(
				new AppError("Please provide a valid email and password", 400)
			);
		const user = await User.findOne({ email }).select("+password");
		// comparePasswords compares the password entered by the user and the password stored in the database
		if (
			!user ||
			!(await user.comparePasswords(password, user.password as string))
		)
			return next(new AppError("No such user exists", 401));

		await sendNewToken(user, res, 200);
	}
);

/**
 * @brief Function to logout signed in users
 * @param {UserRequest} req - request
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @approach
 * ```
 * remove json-webtoken cookie from request header
 * ```
 * @return NA
 * @author `Gaurang Tyagi`
 */
export const logout = catchAsync(
	async (
		_req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		_next: ExpressTypes.NextFn
	) => {
		res.clearCookie("jwt");
		return res.status(200).json({
			status: "success",
		});
	}
);

/**
 * @brief Function to check authentication of a user
 * @param {UserRequest} req - `{cookies: {jwt: "jwt token"}}` - request
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @approach
 * ```
 * if (no token found) => return with error code 200
 * if (no user found with token) => return with error code 401
 * if (password recently updated) => return with error code 200
 * else 'return user data in response'
 * ```
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
export const isLoggedIn = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		_next: ExpressTypes.NextFn
	) => {
		let token: string | undefined;
		if (req.cookies) token = req.cookies?.jwt;
		if (!token)
			return res.status(200).json({
				status: "fail",
				isLoggedIn: false,
				data: {
					message: "Invalid token",
				},
			});

		const verifyAsync = promisify(jwt.verify) as (
			token: string,
			secret: string
		) => Promise<JwtPayload>;
		const jt = await verifyAsync(token, process.env.JWT_SIGN as string);
		const id = jt?.id;
		const issuedAt = jt?.iat;
		const user = await User.findOne({ _id: id });
		if (!user) {
			return res.status(401).json({
				status: "fail",
				isLoggedIn: false,
				data: {
					message: "Unauthenticated",
				},
			});
		}
		if (user.passwordUpdatedAfter(issuedAt as number)) {
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
	}
);

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
 * @approach
 * ```
 * if (name, email, password, or confirmPassword is missing OR password !== confirmPassword) => return with error 400
 * if (User creation fails) => return with error code 500
 * else 'Send a new JWT token to the user and respond with status 201'
 * ```
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
export const signup = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const { name, email, password, confirmPassword } = req.body;
		if (
			!name ||
			!email ||
			!password ||
			!confirmPassword ||
			password !== confirmPassword
		)
			return next(new AppError("Please provide valid details", 400));
		const newUser = await User.create({
			name,
			email,
			password,
			confirmPassword,
			avatar: genProfileString(12),
		});
		if (!newUser) return next(new AppError("Failed to signup", 500));
		await sendNewToken(newUser, res, 201);
	}
);

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
 * @approach
 * ```
 * if (users email is already verified) => return status code 200 
 * if (user not found OR provided OTP does not match stored OTP after bcrypt comparison) => return with error code 400
 * else 'return status 200'
 * ```
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
export const verifyEmail = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const userOtp = req?.body?.otp;
		const isVerified = req.user?.isVerified;
		// const isOtpGen = req.user!.otp;
		const isOtpGen = await redisClient.hGet(req.user?.id, "otp");
		if (isVerified)
			return res.status(200).json({
				status: "success",
				data: {
					message: "Your email is already verified",
				},
			});
		else if (isOtpGen && userOtp) {
			// Find a user which has the same otp and the otp's expire time is greater than the current time
			const user = await User.findById(req.user?.id);
			const storedOtp = await redisClient.hGet(user?.id, "otp");
			if (
				!user ||
				!(await bcrypt.compare(userOtp, storedOtp as string))
			) {
				return next(new AppError("Invalid OTP", 400));
			}

			user!.isVerified = true;
			await user!.save({ validateBeforeSave: false });

			res.status(200).json({
				status: "success",
				data: {
					message: "email verified successfully",
				},
			});
		} else {
			const otp = Math.floor(Math.random() * 10000)
				.toString()
				.padEnd(4, "0");
			const hashedOTP = await bcrypt.hash(otp, 12);
			await redisClient.hSet(req.user?.id, {
				otp: hashedOTP,
			});
			const expireResult = await redisClient.expire(
				req.user?.id,
				parseInt(process.env.OTP_EXPIRE_TIME as string) * 60 * 1000
			);
			if (expireResult !== 1) {
				console.log(`Failed to set TTL for hash '${req.user?.id}'.`);
			}
			await new Email(
				{
					userName: req.user?.name as string,
					email: req.user?.email as string,
					otp,
				},
				""
			).sendVerification();
			res.status(200).json({
				status: "success",
				data: {
					message: "otp sent successfully",
				},
			});
		}
	}
);

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
 * @approach
 * ```
 * if (email is missing from request body) => return with error code 400
 * if (user not found with that email) => return with error code 400
 * else 'status 200 with "Mail sent successfully"' 
 * ```
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
export const forgotPassword = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const email = req.body.email;
		if (!email)
			return next(new AppError("Please provide a valid email id", 400));
		const user = await User.findOne({ email }).select("+password");
		if (!user)
			return next(
				new AppError("No such user with that email exists", 400)
			);
		const resetToken = user.createPasswordResetToken();
		await user.save({ validateBeforeSave: false });

		const url = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;
		try {
			await new Email(
				{
					userName: user.name,
					email: user.email,
				},
				url
			).sendResetLink();
			return res.status(200).json({
				status: "success",
				data: {
					message: "Mail sent successfully",
				},
			});
		} catch (err) {
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
	}
);

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
 * @approach
 * ```
 * if (password OR confirmPassword is missing) => return with error code 400
 * if (user not found with valid/non-expired token) => return with error code 400
 * else 'JWT token to the user and respond with status 200'
 * ```
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
export const resetPassword = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const password = req.body.password;
		const confirmPassword = req.body.confirmPassword;
		const resetToken = req.params.resetToken;

		if (!password || !confirmPassword)
			return next(new AppError("Password is required", 400));

		const hashedToken = crypto
			.createHash("sha256")
			.update(resetToken)
			.digest("hex");
		const user = await User.findOne({
			resetPasswordToken: hashedToken,
			resetTokenExpireTime: { $gte: Date.now() },
		}).select("+password");
		if (!user) return next(new AppError("Invalid token or password", 400));

		user.password = password;
		user.confirmPassword = confirmPassword;
		user.resetTokenExpireTime = undefined;
		user.resetPasswordToken = undefined;

		await user.save();
		await sendNewToken(user, res, 200);
	}
);

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
 * @approach
 * ```
 * if (any of prevPassword, password, or confirmPassword is missing) => return with error code 400
 * if (user is not found OR prevPassword does not match stored password) => return with error code 400
 * else'new JWT token to the user and respond with status 200'
 * ```
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
export const updatePassword = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const prevPassword = req.body.prevPassword;
		const password = req.body.password;
		const confirmPassword = req.body.confirmPassword;
		if (!password || !confirmPassword || !prevPassword)
			return next(new AppError("Please provide a valid password", 400));

		const user = await User.findById(req.user?._id).select("+password");
		if (
			!user ||
			!(await user.comparePasswords(
				prevPassword,
				user.password as string
			))
		) {
			return next(new AppError("Incorrect previous password", 400));
		}
		user!.password = password;
		user!.confirmPassword = confirmPassword;
		await user!.save();

		user!.password = undefined;
		await sendNewToken(user, res, 200);
	}
);
