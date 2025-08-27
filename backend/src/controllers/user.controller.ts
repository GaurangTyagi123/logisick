import catchAsync from "../utils/catchAsync";
import User from "../models/user.model";
import AppError from "../utils/appError";
import checkRequestBody from "../utils/checkRequestBody";

export const getUsers = catchAsync(
	async (
		req: ExpressTypes.Request,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
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
			updatedUser = updatedUser = await User.findByIdAndUpdate(
				req.user?._id,
				newData,
				{ new: true, runValidators: true }
			);
		if (!updateUser) return next(new AppError("There was an error", 500));
		return res.status(200).json({
			status: "success",
			data: {
				updatedUser,
			},
		});
	}
);
export const deleteUser = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: ExpressTypes.Response,
		next: ExpressTypes.NextFn
	) => {
		await User.findByIdAndUpdate(req.user?._id, {
			active: false,
		});
		return res.status(204);
	}
);
// TODO: Add routes to the above two handlers
