"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = exports.protect = exports.restrictTo = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const employee_model_1 = __importDefault(require("../models/employee.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const util_1 = require("util");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const csurf_1 = __importDefault(require("csurf"));
/**
 * @brief To restrict according to the roles
 * @param {string} orgid - organization's id of which the restriction is applied for
 * @param {string} userid - user's id to which the restriction is applied
 * @param {Admin | Manager | Staff | Owner} roles Admin | Manager | Staff | Owner to allow for (comma seperated)
 * @return none
 * @author `Gaurang Tyagi`
 */
const restrictTo = (...roles) => {
    return (async (req, res, next) => {
        const { role } = (await employee_model_1.default.findOne({
            userid: req.user?._id,
            orgid: req.params?.orgid,
        }));
        if (roles.includes(role))
            return next();
        return next(new appError_1.default("You are not authorized", 401));
    });
};
exports.restrictTo = restrictTo;
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
exports.protect = (0, catchAsync_1.default)(async (req, _res, next) => {
    let token;
    if (req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ").at(1);
    }
    if (!token)
        return next(new appError_1.default("Invalid Token", 401));
    const verifyAsync = (0, util_1.promisify)(jsonwebtoken_1.default.verify);
    const jt = await verifyAsync(token, process.env.JWT_SIGN);
    const id = jt?.id;
    const issuedAt = jt?.iat;
    const user = await user_model_1.default.findById(id);
    if (!user)
        return next(new appError_1.default("Unauthenticated", 401));
    if (user.passwordUpdatedAfter(issuedAt))
        return next(new appError_1.default("Password updated recently", 401));
    req.user = user;
    return next();
});
exports.csrfProtection = (0, csurf_1.default)({ cookie: true });
