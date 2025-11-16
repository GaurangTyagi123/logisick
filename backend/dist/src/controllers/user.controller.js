"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.getUsers = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const checkRequestBody_1 = __importDefault(require("../utils/checkRequestBody"));
const employee_model_1 = __importDefault(require("../models/employee.model"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
// TODO : function not request anywhere
/**
 * @brief Controller Function to retrieve a list of all non-admin users in the system.
 * @param {ExpressTypes.Request} req - request (body and params are ignored, authorization token is used for context).
 * @param {ExpressTypes.Response} res - response to set and return response to
 * @param {ExpressTypes.NextFn} _next - next function to chain request
 * @return NA
 * @sideEffect Queries the database for all User documents where the role is *not* 'admin'. Sends a 200 JSON response with the total number of users found and the user list.
 * @author `Gaurang Tyagi`
 */
exports.getUsers = (0, catchAsync_1.default)(async (_req, res, _next) => {
    const users = await user_model_1.default.find({ role: { $ne: "admin" } });
    const results = users.length;
    return res.status(200).json({
        status: "success",
        results,
        data: {
            users,
        },
    });
});
/**
 * @brief Controller Function to retrieve a single user's details by their unique ID.
 * @param {ExpressTypes.Request} req
 * ```
 * {
 * 		params: {
 * 			id: 'user_mongo_id'
 * 		}
 * }
 * ```
 * request containing the user ID in params.
 * @param {ExpressTypes.Response} res - response to set and return response to
 * @param {ExpressTypes.NextFn} next - next function to chain request
 * @return NA
 * @sideEffect Finds the User document by ID. Sends a 200 JSON response with the user data if found, or a 400 error otherwise.
 * @author `Gaurang Tyagi`
 */
exports.getUser = (0, catchAsync_1.default)(async (req, res, next) => {
    const id = req.params.id;
    if (!id)
        return next(new appError_1.default("Please provide a valid user id", 400));
    const user = await user_model_1.default.findById(id);
    if (!user)
        return next(new appError_1.default("No such user exists", 400));
    return res.status(200).json({
        status: "success",
        data: {
            user,
        },
    });
});
/**
 * @brief Controller Function to update the authenticated user's profile details (excluding password).
 * @param {UserRequest} req
 * ```
 * {
 * 		user: {
 * 			_id: 'authenticated_user_mongo_id'
 * 		},
 * 		body: {
 * 			name?: 'New Name',
 * 			email?: 'new@email.com',
 * 			avatar?: 'new_avatar_url'
 * 			* Note: password/confirmPassword are strictly forbidden. *
 * 		}
 * }
 * ```
 * request containing fields to update in the body.
 * @param {ExpressTypes.Response} res - response to set and return response to
 * @param {ExpressTypes.NextFn} next - next function to chain request
 * @return NA
 * @sideEffect
 * - Updates the authenticated user's document with valid fields from the request body.
 * - **Crucially, if the email field is updated, the `isVerified` flag is automatically set to `false`, requiring re-verification.**
 * - If only non-email fields are updated, the function selects fields excluding `__v` for the response.
 * - Sends a 200 JSON response with the updated user data.
 * @author `Gaurang Tyagi`
 */
exports.updateUser = (0, catchAsync_1.default)(async (req, res, next) => {
    if (req.body.password || req.body.confirmPassword)
        return next(new appError_1.default("Password cannot be updated here", 400));
    let newData = req.body;
    newData = (0, checkRequestBody_1.default)(newData, [
        "isVerified",
        "role",
        "passwordUpdatedAt",
    ]);
    let updatedUser;
    if (newData.email) {
        newData.isVerified = false;
        updatedUser = await user_model_1.default.findByIdAndUpdate(req.user?._id, newData, {
            new: true,
            runValidators: true,
        });
    }
    else
        updatedUser = await user_model_1.default.findByIdAndUpdate(req.user?._id, newData, {
            new: true,
            runValidators: true,
        }).select("-__v");
    if (!exports.updateUser)
        return next(new appError_1.default("There was an error", 500));
    return res.status(200).json({
        status: "success",
        data: {
            updatedUser,
        },
    });
});
/**
 * @brief Controller Function to soft-delete the authenticated user's account. This action is blocked if the user is currently an owner or an employee of any organization.
 * @param {UserRequest} req
 * ```
 * {
 *		user: {
 * 			_id: 'authenticated_user_mongo_id'
 * 		}
 * }
 * ```
 * request containing the authenticated user object.
 * @param {ExpressTypes.Response} res - response to set and return response to
 * @param {ExpressTypes.NextFn} next - next function to chain request
 * @return NA
 * @sideEffect
 * - Checks for active organization ownership (Org.findOne). If found, returns 400 error.
 * - Checks for any existing employee association (Emp.findOne). If found, returns 400 error.
 * - If checks pass, soft-deletes the User document using `User.deleteById()`.
 * - Sends a **204 No Content** response upon successful deletion.
 * @author `Gaurang Tyagi`
 */
exports.deleteUser = (0, catchAsync_1.default)(async (req, res, next) => {
    if (!req.user)
        return next(new appError_1.default("User not authenticated", 401));
    const orgOwner = await organization_model_1.default.findOne({ owner: req.user?._id });
    if (orgOwner)
        return next(new appError_1.default("Transfer ownership of your organization first", 400));
    const anyOrgEmployee = await employee_model_1.default.findOne({ userid: req.user?._id });
    if (anyOrgEmployee)
        return next(new appError_1.default("Employee of an org can't be deleted by user. Contact owner/admin of org", 400));
    await user_model_1.default.deleteById(req.user?._id);
    return res.status(204).end();
});
