import Org from "../models/organization.model";
import Emp from "../models/employee.model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import type { NextFunction, Response } from "express";

/**
 * @brief Function to return organization in the response of api request
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
				totalEmployees: org.totalEmployees,
				slug: org.slug,
				createdAt: org.createdAt,
				updatesAt: org.updatedAt,
			},
		},
	});
}

export const getOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const orgSlug = req.params?.orgSlug;
		if (!orgSlug)
			return next(
				new AppError("Please provide a valid organization id", 400)
			);
		const org = await Org.findOne({ slug: orgSlug });
		if (!org) return next(new AppError("No such organization exists", 400));

		returnOrgRes(res, 200, org);
	}
);

/**
 * @brief Function to create new organization by verified user who has no organization prior as owner
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @return IF (user not verified ) return error with status 400
 * 			ELSE IF (user already an owner) return error with status 400
 * 			ELSE IF (name is not given in body) return error with status 404
 * 			ELSE IF (org or emp creation fails) return error with status 500
 * 			ELSE call returnOrgRes Function with new org details and 201 status
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
		const existingOrgs = await Org.findWithDeleted({
			owner: req.user._id,
		});

		const existingOrg = existingOrgs.some((org) => !org.deleted);

		if (existingOrg) {
			return next(
				new AppError("Owner already has an active organization", 400)
			);
		}
		const { name, description, type } = req.body;
		if (!name)
			return next(
				new AppError(
					"Name id required while creating organization",
					404
				)
			);

		const newOrgData: {
			name?: string;
			description?: string;
			type?: string;
			owner: ObjectId;
		} = { owner: req.user?._id };

		if (name) {
			newOrgData["name"] = name.trim();
		} else {
			return next(new AppError("All fields are required (name)", 404));
		}
		if (description) newOrgData["description"] = description.trim();
		else return next(new AppError("Invalid data", 400));

		if (type) {
			newOrgData["type"] = [
				"Basic",
				"Small-Cap",
				"Mid-Cap",
				"Large-Cap",
				"Other",
			].includes(type.trim())
				? type.trim()
				: "Basic";
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
 * @brief function to get organization of which user is owner of
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @return IF (user dont have any orgs ) return error with status 404
 * 			ELSE call returnOrgRes Function with user's org and status 200
 */
// export const getUserOrg = catchAsync(
//     async (
//         req: ExpressTypes.UserRequest,
//         res: Response,
//         next: NextFunction
//     ) => {
//         const org = await Org.findOne({ owner: req.user?._id });

//         if (!org)
//             return next(new AppError("User doesn't own any organization", 404));
//         return returnOrgRes(res, 200, org);
//     }
// );

/**
 * @brief function to update data of organization like (name,description,type)
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 * @return IF (name and is not valid) return error with 400
 * 			IF (description and not valid description) return error with 400
 * 			ELSE return the updated
 */
export const updateOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { orgid } = req.params;
		const { name, description, type } = req.body;

		const dataToUpdate: {
			name?: string;
			description?: string;
			type?: "Basic" | "Small-Cap" | "Mid-Cap" | "Large-Cap" | "Other";
		} = {};

		if (name && name.trim() === "")
			return next(new AppError("Invalid data", 400));
		dataToUpdate.name = name;

		if (description && description.trim() === "") {
			return next(new AppError("Invalid data", 400));
		}
		dataToUpdate.description = description;

		if (type && type.trim() !== "") {
			if (
				[
					"Basic",
					"Small-Cap",
					"Mid-Cap",
					"Large-Cap",
					"Other",
				].includes(type.trim())
			) {
				dataToUpdate["type"] = type.trim();
			} else {
				dataToUpdate["type"] = "Other";
			}
		}
		const newOrgData = await Org.findByIdAndUpdate(orgid, dataToUpdate, {
			new: true,
		});
		if (!newOrgData)
			return next(new AppError("Error updating organization data", 500));
		return returnOrgRes(res, 200, newOrgData);
	}
);

/**
 * @brief Function to transfer ownership of an organization
 * @param req(UserRequest)
 * @param res(ExpressRexponse)
 * @param next(Express Next Function)
 *
 */
export const transferOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { newOwnerId } = req.body;
		if (!newOwnerId)
			return next(new AppError("New Owner's details is required", 404));

		const oldOwner = req.user;
		if (!oldOwner) return next(new AppError("Unauthenticated", 403));

		const org = req.user?.myOrg;
		if (!org)
			return next(new AppError("You don't own any organization", 404));

		const canBeNewOwner = await Emp.findOne({
			userid: newOwnerId,
			orgid: org._id,
			role: "Admin",
			deleted: false,
		});
		if (!canBeNewOwner)
			return next(
				new AppError(
					"Only admin of same organization can be new owner",
					400
				)
			);

		// TODO : check if the newOwner is already an existing owner
		// if (newOwner) {
		// 	// delete old owner emp
		// 	await Emp.delete({ userid: oldOwner._id, role: "Owner" });
		// 	// change role of newOwner to "Owner"
		// 	newOwner.role = "Owner";
		// 	await newOwner.save();
		// 	// change owner of org to newowner id
		// 	const newOrgData = await Org.findByIdAndUpdate(
		// 		org._id,
		// 		{ owner: newOwner._id },
		// 		{ new: true }
		// 	);
		// 	if (!newOrgData)
		// 		return next(new AppError("Error transfering ownership", 500));
		// 	// return org data of new org
		// 	return returnOrgRes(res, 200, newOrgData);
		// } else {
		// 	// new Owner is any employee
		// 	const isEmp = await Emp.findOne({ userid: newOwnerId });
		// 	if (isEmp)
		// 		return next(
		// 			new AppError(
		// 				"Employee of other organization can't become owner",
		// 				400
		// 			)
		// 		);
		// 	// delete old owner
		// 	await Emp.delete({ userid: oldOwner._id, role: "Owner" });
		// 	// make new employee of owner
		// 	const brandNewOwner = await Emp.create({
		// 		userid: newOwnerId,
		// 		orgid: org._id,
		// 		role: "Owner",
		// 	});
		// 	if (!brandNewOwner)
		// 		return next(new AppError("Error adding new Owner", 500));
		// 	// if not update org to have new owner
		// 	const newOrgData = await Org.findByIdAndUpdate(
		// 		org._id,
		// 		{ owner: brandNewOwner._id },
		// 		{ new: true }
		// 	);
		// 	if (!newOrgData)
		// 		return next(new AppError("Error transfering ownership", 500));
		// 	// return org data of new org
		// 	return returnOrgRes(res, 200, newOrgData);
		// }
	}
);

/**
 * @brief Function to delete an organization (done by only owner)
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
		const { orgid } = req.params;
		if (!orgid)
			return next(
				new AppError(
					"Orgnization indentification is required to delete",
					404
				)
			);

		const org = await Org.delete({ _id: orgid, owner: req.user?._id });
		if (!org.modifiedCount)
			return next(new AppError("No such org exists", 400));

		await Emp.delete({ orgid });

		return res.status(204).send();
	}
);
