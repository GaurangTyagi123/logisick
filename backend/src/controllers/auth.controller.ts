import catchAsync from "../utils/catchAsync";
import AppError from "../utils/appError";
import Email from "../utils/sendEmail";
import { genProfileString } from "../utils/avatarGen";

import { promisify } from "util";
import crypto from "crypto";
import bcrypt from "bcryptjs";

//I MODELS
import User from "../models/user.model";

//I TYPES
import jwt, { type JwtPayload } from "jsonwebtoken";
import type { StringValue } from "ms";
import { redisClient } from "../app";

/**  @returns json-webtoken with user-id as payload */
const signToken = (id: ObjectId) => {
	const JWTSign = process.env.JWT_SIGN as string;
	const JWTExpire = process.env.JWT_EXPIRE_TIME as StringValue;
	return jwt.sign({ id }, JWTSign, { expiresIn: JWTExpire });
};

/**
 * @objective To send the generated json-webtoken with the response header
 * @param: user(UserType) res(Express Response object) statusCode
 * @returns JSON response ->
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
 *      }
 */
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
		secure: process.env.NODE_ENV === "production",
	};

	res.cookie("jwt", token, cookieOptions);

	return res.status(statusCode).json({
		status: "success",
		token,
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

// /**
//  * @obective To restrict according to the roles
//  * @param roles admin | manager | staff
//  * @returns NA
//  */
// export const restrictTo = (...roles: string[]) => {
// 	return (
// 		req: ExpressTypes.Request,
// 		res: ExpressTypes.Response,
// 		next: ExpressTypes.NextFn
// 	) => {
// 		const { role } = req.user as UserType;
// 		if (roles.includes(role as string)) return next();
// 		return next(new AppError("You are not authorized", 401));
// 	};
// };

/**
 * @brief Function to protect the routes from non-loggedin users
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @headers jwt(http only cookie)
 * @approach check if the json-webtoken in the header is correct.
 *           IF the token is correct then call the next middleware
 *           ELSE return 401 (unauthorized access)
 * @sideEffect attaches user data to the request object of the subsequent middlewares
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
		if (req.cookies) {
			token = req.cookies?.jwt;
		}
		if (!token) return next(new AppError("Invalid Token", 401));
		const verifyAsync = promisify(jwt.verify) as (
			token: string,
			secret: string
		) => Promise<JwtPayload>;
		const { id, iat: issuedAt } = await verifyAsync(
			token,
			process.env.JWT_SIGN as string
		);
		const user = await User.findById(id);
		if (!user) return next(new AppError("Unauthenticated", 401));

		if (user.passwordUpdatedAfter(issuedAt as number))
			return next(new AppError("Password updated recently", 401));

		req.user = user;
		return next();
	}
);

/**
 * @brief Function to loginexisting users
 * @param req(Express Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @body email (user email) password (user password)
 * @return IF (details are correct) send new json-webtoken
 *         ELSE return status 400
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

		sendNewToken(user, res, 200);
	}
);

/**
 * @brief Function to logout signed in users
 * @param req(Express Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @approach remove json-webtoken cookie from request header
 * @return IF (details are correct) send new json-webtoken
 *         ELSE return status 400
 */
export const logout = catchAsync(
	async (
		_req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		_next: ExpressTypes.NextFn
	) => {
		const cookieOptions: cookieOptionsType = {
			httpOnly: true,
			expires: new Date(Date.now() + 10),
		};
		res.cookie("jwt", undefined, cookieOptions);
		return res.status(200).json({
			status: "success",
		});
	}
);

/**
 * @brief Function to check authentication of a user
 * @param req(Express Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @requestHeader json-webtoken
 * @return IF (json-webtoken is valid) return user data
 *         ELSE return status:fail with reason for the same
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
		const { id, iat: issuedAt } = await verifyAsync(
			token,
			process.env.JWT_SIGN as string
		);
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
 * @brief Function to signup new user
 * @param req(Express Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @body name(user name) email (user email) password (user password) confirmPassword (password confirmation)
 * @return IF (details are correct) store user's data in the database and send the new token with the request header
 *         ELSE IF(details are incomplete) return status:400 (invalid request)
 *         ELSE return status:500 (internal server error)
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
		sendNewToken(newUser, res, 201);
	}
);

/**
 * @brief Function to verify email id of user
 * @param req(User Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @preCondition user is logged in
 * @body OTP or empty
 * @approach if the body is empty then generate and store the otp in the database and send it to user's email
 *           else check if the user's otp is same as the otp stored in the database and if it is then update user's isVerified field to true
 * @return IF (user is verified) send status:200 message: Your email is already verified
 *         ELSE IF (user's otp is correct) status:200 message email verified successfully
 *         ELSE return status:400 message:invalid otp
 * @sideEffect User email is verified
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
				status: "successfull",
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
 * @brief Function to handle case if user forgot th password
 * @param req(Express Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @preCondition user is logged in
 * @body email (user email)
 * @return IF (email is correct) send reset password url with reset-token to the user's email
 *         ELSE return status:400 (invalid request)
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

		// const url = `${req.protocol}//${req.host}/resetpassword/${resetToken}`;
		const url = `${req.protocol}://localhost:5173/resetpassword/${resetToken}`;
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
 * @brief Function to reset user password if he forgets
 * @param req(Express Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @body  password (new password) confirmPassword (to confirm the new password)
 * @requestParams resetToken
 * @return IF (details are correct) reset the password and generate new token
 *         ELSE return status:400 message: invalid token or previous password
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
		sendNewToken(user, res, 200);
	}
);

/**
 * @brief Function to update the password ofuseron request
 * @param req(User Request)
 * @param res(Express Response)
 * @param next(Express Next Function)
 * @preCondition user is logged in
 * @body prevPassword (previous password) password (new password) confirmPassword (password confirmation)
 * @return IF (details are correct) update the password and send the updated user data as response
 *         ELSE return status:400 message:incomplete details
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
		sendNewToken(user, res, 200);
	}
);
