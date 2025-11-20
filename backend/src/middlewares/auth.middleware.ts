
import { RequestHandler } from "express";

import User from "../models/user.model";
import Employee from "../models/employee.model";

import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import { promisify } from "util";
import jwt, { type JwtPayload } from "jsonwebtoken";
import csurf from "csurf";


/**
 * @brief To restrict according to the roles
 * @param {string} orgid - organization's id of which the restriction is applied for
 * @param {string} userid - user's id to which the restriction is applied
 * @param {Admin | Manager | Staff | Owner} roles Admin | Manager | Staff | Owner to allow for (comma seperated)
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

export const csrfProtection = csurf({ cookie: true });