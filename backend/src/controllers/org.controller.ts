import Org from "../models/organization.model";
import Emp from "../models/employee.model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import type { NextFunction, Response } from "express";

function returnOrgRes(res: Response, status: number, org: OrgType): Response {
	return res.status(status).json({
		status: "success",
		data: {
			org: {
				_id: org._id,
				name: org.name,
				description: org.description,
				type: org.type,
				owner: org.owner,
				subscription: org.subscription,
				createdAt: org.createdAt,
				updatesAt: org.updatedAt,
			},
		},
	});
}

export const createOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		if (!req.user?.isVerified) {
			return next(
				new AppError(
					"User must be verified to create new organization",
					400
				)
			);
		}

		const alreadyOwner = await Emp.findOne({ owner: req.user?._id });
		if (alreadyOwner)
			return next(
				new AppError("User can only be owner of one organization", 400)
			);

		const { name, description, type } = req.body;
		if (!name)
			return next(
				new AppError(
					"Name id required while creating organization",
					404
				)
			);

		let newOrgData: {
			name: string;
			description?: string;
			type?: string;
			owner: ObjectId;
		} = { name, owner: req.user?._id };

		if (description) newOrgData["description"] = description;
		if (type) {
			if (
				![
					"Basic",
					"Small-Cap",
					"Mid-Cap",
					"Large-Cap",
					"Other",
				].includes(type)
			) {
				return next(
					new AppError("Wrogn type given to Organization", 400)
				);
			}
			newOrgData["type"] = type;
		}

		const newOrg = await Org.create(newOrgData);
		if (!newOrg)
			return next(new AppError("Failed to create new Organization", 500));

		const newEmp = await Emp.create({
			userid: req.user?._id,
			orgid: newOrg._id,
			role: "Owner",
		});
		if (!newEmp)
			return next(new AppError("Failed to create new Employee", 500));

		return returnOrgRes(res, 201, newOrg);
	}
);

export const getUserOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const org = await Org.findOne({ owner: req.user?._id });

		if (!org)
			return next(new AppError("User doesn't own any organization", 404));
		return returnOrgRes(res, 200, org);
	}
);

// TODO : function to update org details (only name,description,type,subscription and admin)
// TODO : function to transfer ownership only by owner itself

export const deleteOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { orgid } = req.body;
		if (!orgid)
			return next(
				new AppError(
					"Orgnization indentification is required to delete",
					404
				)
			);

		const orgToDel = await Org.findOne({ orgid, owner: req.user?._id });
		if (!orgToDel) return next(new AppError("Organization not found", 404));

		await orgToDel.deleteOne();

		const orgLeft = await Org.findById(orgToDel._id);
		if (orgLeft)
			return next(new AppError("Error deleteing organization", 500));

		await Emp.deleteMany({ orgid: orgToDel._id });
		const empLeft = await Emp.find({ orgid: orgToDel._id });
		if (empLeft.length !== 0)
			return next(
				new AppError("Error deleteing employees of organization", 500)
			);

		return res.status(204).send();
	}
);
