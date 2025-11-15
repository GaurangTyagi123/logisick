import catchAsync from "../utils/catchAsync";
import User from "../models/user.model";
import AppError from "../utils/appError";
import checkRequestBody from "../utils/checkRequestBody";
import Emp from "../models/employee.model";
import Org from "../models/organization.model";

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
export const getUsers = catchAsync(
	async (
		_req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		_next: ExpressTypes.NextFn
	) => {
		const users = await User.find({ role: { $ne: "admin" } });
		const results = users.length;
		return res.status(200).json({
			status: "success",
			results,
			data: {
				users,
			},
		});
	}
);

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
export const getUser = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		const id = req.params.id;
		if (!id)
			return next(new AppError("Please provide a valid user id", 400));

		const user = await User.findById(id);
		if (!user) return next(new AppError("No such user exists", 400));

		return res.status(200).json({
			status: "success",
			data: {
				user,
			},
		});
	}
);

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
export const updateUser = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		if (req.body.password || req.body.confirmPassword)
			return next(new AppError("Password cannot be updated here", 400));
		let newData = req.body;
		newData = checkRequestBody(newData, [
			"isVerified",
			"role",
			"passwordUpdatedAt",
		]);
		let updatedUser;
		if (newData.email) {
			newData.isVerified = false;
			updatedUser = await User.findByIdAndUpdate(req.user?._id, newData, {
				new: true,
				runValidators: true,
			});
		} else
			updatedUser = await User.findByIdAndUpdate(req.user?._id, newData, {
				new: true,
				runValidators: true,
			}).select("-__v");
		if (!updateUser) return next(new AppError("There was an error", 500));
		return res.status(200).json({
			status: "success",
			data: {
				updatedUser,
			},
		});
	}
);

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
export const deleteUser = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		if (!req.user) return next(new AppError("User not authenticated", 401));

		const orgOwner = await Org.findOne({ owner: req.user?._id });
		if (orgOwner)
			return next(
				new AppError(
					"Transfer ownership of your organization first",
					400
				)
			);

		const anyOrgEmployee = await Emp.findOne({ userid: req.user?._id });
		if (anyOrgEmployee)
			return next(
				new AppError(
					"Employee of an org can't be deleted by user. Contact owner/admin of org",
					400
				)
			);

		await User.deleteById(req.user?._id);
		return res.status(204).end();
	}
);
