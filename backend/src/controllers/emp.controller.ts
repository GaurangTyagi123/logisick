import { Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Org from "../models/organization.model";
import Emp from "../models/employee.model";
import { Types } from "mongoose";
import AppError from "../utils/appError";

// TODO : send emp invite to join org (by email id) (by owner/admin) (emp should be verified)
// Function to get emps by orgid
export const getEmps = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { orgid } = req.body;
		if (!orgid) return next(new AppError("orgid field is requied", 404));

		const emps = await Emp.aggregate([
			{
				$match: {
					orgid: new Types.ObjectId(orgid),
					$or: [{ deleted: false }, { deleted: { $exists: false } }],
				},
			},
			{
				$lookup: {
					from: "organizations",
					localField: "orgid",
					foreignField: "_id",
					as: "organization",
				},
			},
			{ $unwind: "$organization" },
			{
				$match: {
					$or: [
						{ "organization.deleted": false },
						{ "organization.deleted": { $exists: false } },
					],
				},
			},
			{
				$project: {
					organization: 0,
				},
			},
		]);

		return res.status(200).json({
			status: "success",
			data: {
				emps: emps.map((emp) => {
					return {
						userid: emp.userid,
						orgid: emp.orgid,
						role: emp.role,
						manager: emp.manager,
						createdAt: emp.createdAt,
						updatedAt: emp.updatedAt,
					};
				}),
			},
		});
	}
);

// Function to get organization of which i am member of
export const getMyOrgs = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		_next: NextFunction
	) => {
		const orgs = await Emp.aggregate([
			{
				$match: {
					userid: new Types.ObjectId(req.user?._id),
					// deleted: false,
				},
			},
			{
				$lookup: {
					from: "organizations",
					localField: "orgid",
					foreignField: "_id",
					as: "organizationDetails",
				},
			},
			{
				$unwind: {
					path: "$organizationDetails",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$match: {
					"organizationDetails.deleted": false,
				},
			},
			{
				$replaceRoot: {
					newRoot: {
						$mergeObjects: [
							"$organizationDetails",
							{ role: "$role" },
						],
					},
				},
			},
		]);

		console.log(orgs);
		return res.status(200).json({
			status: "success",
			data: {
				orgs: orgs.map((org) => {
					return {
						_id: org._id,
						name: org.name,
						description: org.description,
						type: org.type,
						role: org.role,
						owner: org.owner,
						admin: org.admin,
						subscription: org.subscription,
						members: org.members,
						createdAt: org.createdAt,
						updatesAt: org.updatedAt,
					};
				}),
			},
		});
	}
);

// Function to change roles of user (by owner/admin)
export const changeRole = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { newRole, userid, managerid } = req.body;
		if (!newRole || !userid)
			return next(new AppError("Neccessary fields not found", 404));

		const org = await Org.findOne({
			$or: [{ owner: req.user?._id }, { admin: req.user?._id }],
			deleted: false,
		});
		if (!org) return next(new AppError("No organization found", 404));

		const oldEmp = await Emp.findOne({
			orgid: org._id,
			userid,
			deleted: false,
		});
		if (!oldEmp) return next(new AppError("Not an existing employee", 404));

		const dataToUpdate: {
			role?: "Manager" | "Staff" | "Admin";
			manager?: ObjectId;
		} = {};

		if (newRole.trim() === "Manager") {
			dataToUpdate.role = "Manager";
			dataToUpdate.manager = req.user?._id;
		} else if (newRole.trim() === "Staff") {
			dataToUpdate.role = "Staff";
			const isManager = await Emp.findOne({
				orgid: org._id,
				userid: managerid,
				role: "Manager",
				deleted: false,
			});
			if (!isManager)
				return next(new AppError("Not an existing manager", 404));
			else dataToUpdate.manager = managerid;
		} else if (newRole.trim() === "Admin") {
			if (org.owner !== req.user?._id)
				return next(
					new AppError("Not authorised to assign admin", 403)
				);
			dataToUpdate.role = "Admin";
			dataToUpdate.manager = req.user?._id;
		} else {
			return next(new AppError("Not a valid role change", 400));
		}

		const newEmp = await Emp.findOneAndUpdate(
			{
				orgid: org._id,
				userid,
				deleted: false,
			},
			dataToUpdate,
			{ new: true }
		);
		if (!newEmp) return next(new AppError("Error changing role", 500));

		return res.status(200).json({
			status: "success",
			data: {
				emp: {
					userid: newEmp.userid,
					orgid: newEmp.orgid,
					role: newEmp.role,
					manager: newEmp.manager,
					createdAt: newEmp.createdAt,
					updatedAt: newEmp.updatedAt,
				},
			},
		});
	}
);

// TODO : change/assign manager of a staff (by owner/admin)

// TODO : delete employee
