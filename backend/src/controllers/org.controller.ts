import Org from "../models/organization.model";
import Emp from "../models/employee.model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import type { NextFunction, Response } from "express";


/**
 * @objective function to return organization in the response of api request
 * @param res Express response of API request
 * @param status numberical status code
 * @param org data of organization to send to client
 * @returns returns the response with added data as json format
 */
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

/**
 * @objective function to create new organization by verified user who has no organization prior as owner
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @return IF (user not verified ) return error with status 400
 * 			ELSE IF (user already an owner) return error with status 400
 * 			ELSE IF (name is not given in body) return error with status 404
 * 			ELSE IF (org or emp creation fails) return error with status 500
 * 			ELSE call returnOrgRes function with new org details and 201 status
 */
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

/**
 * @objective
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @return IF (user dont have any orgs ) return error with status 404
 * 			ELSE call returnOrgRes function with user's org and status 200
 */
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


/**
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @return IF (orgid is not given in body) return error with status(404)
 * 			ELSE if (User don't have any org with given id as owner) return error with status(404)
 * 			ELSE if (org didn't delete after query) return error with status(500)
 * 			ELSE if (related employees didn't delete after query) return error with status(500)
 * 			ELSE return status(204)
 */
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
