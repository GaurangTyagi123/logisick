import Org from "../models/organization.model";
import Emp from "../models/employee.model";
import User from "../models/user.model";
import AppError from "../utils/appError";
import catchAsync from "../utils/catchAsync";
import type { NextFunction, Response } from "express";

/**
 * @brief Utility function to structure and return a JSON response containing organization data.
 * @param {ExpressRexponse} res - The Express response object.
 * @param {number} status - The HTTP status code to return (e.g., 200, 201).
 * @param {OrgType} org - The Organization object to include in the response body.
 * @return {Response} The Express Response object sent to the client.
 * @sideEffect Sends a JSON response to the client with the specified status code and a simplified organization object.
 * @author `Ravish Ranjan`
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

/**
 * @brief Controller Function to retrieve a single organization's details using its unique URL slug.
 * @param {UserRequest} req 
 * ```
 * {
 * 		params: {
 * 			orgSlug: 'unique-organization-slug'
 * 		}
 * }
 * ```
 * request containing the organization slug in params.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Finds the Organization document by slug and uses `returnOrgRes` to send a 200 JSON response with the organization data.
 * @author `Ravish Ranjan`
 */
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
 * @brief Controller Function to create a new organization (Org) and automatically enroll the verified, authenticated user as the 'Owner'.
 * @param {UserRequest} req 
 * ```
 * {
 * 		user: {
 * 			_id: 'user_mongo_id',
 * 			isVerified: true
 * 		},
 * 		body: {
 * 			name: 'New Org Name',
 * 			description: 'A brief description of the organization.',
 * 			type: 'Basic' | 'Small-Cap' | 'Mid-Cap' | 'Large-Cap' | 'Other',
 * 			...other fields
 * 		}
 * }
 * ```
 * request containing organization details in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect 
 * - Creates a new Organization document.
 * - Creates a corresponding Employee (Emp) document linking the user to the new organization with 'Owner' role.
 * - Sends a 201 JSON response with the newly created organization data.
 * @author `Ravish Ranjan`
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
 * @brief Controller Function to update the name, description, and/or type of an existing organization.
 * @param {UserRequest} req 
 * ```
 * {
 * 		params: {
 * 			orgid: 'organization_mongo_id'
 * 		},
 * 		body: {
 * 			name?: 'New Organization Name',
 * 			description?: 'Updated description',
 * 			type?: 'Small-Cap' | 'Mid-Cap' | 'Large-Cap' // Optional fields to update
 * 			...other updatable fields
 * 		}
 * }
 * ```
 * request containing the organization ID in params and fields to update in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Updates the specified Organization document in the database and sends a 200 JSON response with the updated organization data via `returnOrgRes`.
 * @author `Ravish Ranjan`
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
 * @brief Controller Function to transfer ownership of the organization from the current user to an existing employee.
 * @param {UserRequest} req 
 * ```
 * {
 * 		user: {
 * 			_id: 'current_owner_mongo_id',
 * 			myOrg: {
 * 				 _id: 'org_mongo_id' 
 * 			} // Must contain the organization ID
 * 		},
 * 		body: {
 * 			newOwnerEmail: 'email_of_employee_to_transfer_to'
 * 		}
 * }
 * ```
 * request containing the new owner's email in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect 
 * - Updates the **Organization** document's `owner` field to the new user's ID.
 * - Updates the old owner's **Employee** record (if it exists) to a new non-Owner role (implied, but not explicitly handled here; *must* be done by subsequent logic or middleware).
 * - Updates the new owner's **Employee** record's `role` to 'Owner' and clears their `manager`.
 * - If the new owner was a Manager, clears the `manager` field for all their previous subordinates.
 * - Clears the `admin` field on the Organization document upon transfer.
 * - Sends a 200 JSON response with the updated organization data via `returnOrgRes`.
 * @author `Ravish Ranjan`
 */
export const transferOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { newOwnerEmail } = req.body;
		if (!newOwnerEmail)
			return next(new AppError("New Owner's email is required", 404));

		const oldOwner = req.user;
		if (!oldOwner) return next(new AppError("Unauthenticated", 403));

		const userHasOrg = req.user?.myOrg;
		if (!userHasOrg)
			return next(new AppError("You don't own any organization", 404));

		const org = await Org.findOne({ _id: userHasOrg._id, deleted: false });
		if (!org)
			return next(new AppError("You don't own any organization", 404));

		const newOwnerUserData = await User.findOne({
			email: newOwnerEmail,
			deleted: false,
		});
		if (!newOwnerUserData)
			return next(new AppError("New Owner is not a user", 404));

		const isAlreadyOwner = await Org.findOne({
			owner: newOwnerUserData._id,
			deleted: false,
		});
		if (isAlreadyOwner)
			return next(new AppError("New Owner is already a owner", 400));

		const newOwnerEmpData = await Emp.findOne({
			userid: newOwnerUserData._id,
			orgid: org._id,
			deleted: false,
		});
		if (!newOwnerEmpData)
			return next(
				new AppError(
					"New Owner is not a employee of the organization",
					400
				)
			);

		switch (newOwnerEmpData.role) {
			case "Owner":
				return next(
					new AppError(
						"New Owner is already owner of the organization",
						400
					)
				);
			case "Admin": {
				newOwnerEmpData.role = "Owner";
				newOwnerEmpData.manager = undefined;
				await newOwnerEmpData.save();
				org.owner = newOwnerUserData._id;
				org.admin = null;
				await org.save();
				return returnOrgRes(res, 200, org);
			}
			case "Manager": {
				// ? changed manager of all emp under user to null
				await Emp.updateMany(
					{
						manager: newOwnerUserData._id,
						orgid: org._id,
						deleted: false,
					},
					{ manager: null }
				);
				newOwnerEmpData.role = "Owner";
				newOwnerEmpData.manager = undefined;
				await newOwnerEmpData.save();
				org.owner = newOwnerUserData._id;
				org.admin = null;
				await org.save();
				return returnOrgRes(res, 200, org);
			}
			case "Staff": {
				newOwnerEmpData.role = "Owner";
				newOwnerEmpData.manager = undefined;
				await newOwnerEmpData.save();
				org.owner = newOwnerUserData._id;
				org.admin = null;
				await org.save();
				return returnOrgRes(res, 200, org);
			}
			default: {
				return next(new AppError("New Owner has wrong data", 500));
			}
		}
	}
);

/**
 * @brief Controller Function to soft-delete an organization and all associated employee records.
 * @param {UserRequest} req 
 * ```
 * {
 * 		user: {
 * 			_id: 'owner_mongo_id' // Must match the organization's owner field
 * 		},
 * 		params: {
 * 			orgid: 'organization_mongo_id'
 * 		}
 * }
 * ```
 * request containing the organization ID in params.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect 
 * - Soft-deletes the Organization document by the given ID, verifying that the authenticated user is the **owner**.
 * - Soft-deletes all associated Employee documents for that organization ID.
 * - Sends a **204 No Content** response upon successful operation.
 * @author `Ravish Ranjan`
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
