import type { Response, NextFunction } from "express";
import catchAsync from "../utils/catchAsync";
import Org from "../models/organization.model";
import Emp from "../models/employee.model";
import User from "../models/user.model";
import AppError from "../utils/appError";
import crypto from "crypto";
import { redisClient } from "../app";
import Email from "../utils/sendEmail";
import { Types } from "mongoose";
import ApiFilter from "../utils/apiFilter";

/**
 * @brief function to return emp data after role change
 * @param {EmpType} emp - employee's data
 * @param {Response} res - express response object
 * @returns data in response
 * @author `Ravish Ranjan`
 */
function returnChangedRoleEmp(emp: EmpType, res: Response) {
	return res.status(200).json({
		status: "success",
		data: {
			emp: {
				userid: emp.userid,
				orgid: emp.orgid,
				role: emp.role,
				manager: emp.manager,
				createdAt: emp.createdAt,
				updatedAt: emp.updatedAt,
			},
		},
	});
}

/**
 * @brief Function for an organization owner or admin to send an invitation email to a new employee.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 *      user: UserObject,
 *      body: {
 *          empEmail: "employee@example.com",
 *          role: "Manager"
 *      }
 * }
 * ```
 * request containing the authenticated user (inviter) and the employee's email and intended role.
 * @param {Response} res - response object to set and return response.
 * @param {NextFunction} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 *      status: 'success',
 *      data: {
 *          message: 'invite sent successfully',
 *      },
 * }
 * ```
 * @author `Ravish Ranjan`
 */
export const sendInvite = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		let { empEmail, role } = req.body;
		if (!empEmail || !role)
			return next(new AppError("All fields are required", 404));
		empEmail = empEmail.trim();
		role = role.trim();
		const org = await Org.findOne({
			$or: [{ owner: req.user?._id }, { admin: req.user?._id }],
		});
		if (!org)
			return next(
				new AppError("No organization to add employee to", 404)
			);
		const isOldUser = await User.findOne({ email: empEmail });
		if (isOldUser) {
			const isOldEmp = await Emp.findOne({
				orgid: org._id,
				userid: isOldUser._id,
			});
			if (isOldEmp)
				return next(
					new AppError("Invited user is already an employee", 404)
				);
		}

		const alreadyInvited = await redisClient.hGet(empEmail, "token");
		if (alreadyInvited) {
            const url = `${process.env.FRONTEND_URL}/acceptInvite/${alreadyInvited}`;
			await new Email(
				{
					userName: req.user?.name as string,
					email: req.user?.email as string,
					orgName: org.name,
					role,
				},
				url
			).sendOrgInviteLink();
			return res.status(200).json({
				status: "success",
				data: {
					message: "User Already Invited, Invite email resend",
				},
			});
		}

		const inviteToken = crypto.randomBytes(32).toString("hex");
		if (!["Manager", "Staff", "Admin"].includes(role))
			return next(new AppError("Not a valid role", 400));

		await redisClient.hSet(empEmail, {
			token: inviteToken,
			orgid: org._id.toString(),
			role,
		});

		const exists = await redisClient.exists(empEmail);
		if (!exists) return next(new AppError("Unable to save invite ", 500));

		const expireTime = await redisClient.expire(
			empEmail,
			parseInt(process.env.OTP_EXPIRE_TIME as string) *
				24 *
				60 *
				60 *
				1000
		);
		if (expireTime !== 1) {
			return next(
				new AppError("Failed to generate and save invite token", 500)
			);
		}
		const url = `${process.env.FRONTEND_URL}/acceptInvite/${inviteToken}`;
		await new Email(
			{
				userName: req.user?.name as string,
				email: req.user?.email as string,
				orgName: org.name,
				role,
			},
			url
		).sendOrgInviteLink();

		res.status(200).json({
			status: "success",
			data: {
				message: "invite sent successfully",
			},
		});
	}
);

/**
 * @brief Function for a user to accept an organization invitation and join as an employee.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 *      user: UserObject,
 *      body: {
 *          token: "inviteToken"
 *      }
 * }
 * ```
 * request containing the authenticated user object and the invite token.
 * @param {Response} res - response object to set and return response.
 * @param {NextFunction} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 *      status: 'success',
 *      data: {
 *          emps: {
 *              userid: newEmp.userid,
 *              orgid: newEmp.orgid,
 *              role: newEmp.role,
 *              manager: newEmp.manager,
 *              createdAt: newEmp.createdAt,
 *              updatedAt: newEmp.updatedAt,
 *          },
 *      },
 * }
 * ```
 * @author `Ravish Ranjan`
 */
export const joinOrg = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { token } = req.body;
		if (!token) return next(new AppError("Token not found", 404));
		if (!req.user) return next(new AppError("Unauthenticated", 400));

		if (!req.user.isVerified)
			return next(
				new AppError(
					"User have to be verified to join organiation",
					403
				)
			);
		const {
			token: inviteToken,
			orgid,
			role,
		} = await redisClient.hGetAll(req.user.email);

		if (!role || !orgid || !inviteToken || token.trim() !== inviteToken)
			return next(new AppError("User not invited in organization", 400));

		const newEmpData: {
			userid: ObjectId;
			orgid: string;
			role: string;
		} = {
			userid: req.user._id,
			orgid,
			role,
		};
		const newEmp = await Emp.create(newEmpData);
		if (!newEmp)
			return next(new AppError("Error adding new Employee", 500));

		await redisClient.del(req.user?.email);
		return res.status(201).json({
			status: "success",
			data: {
				emps: {
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

/**
 * @brief Function to retrieve a list of employees for a specific organization, with support for filtering, sorting, projection, and pagination via aggregation pipeline.
 * @param {ExpressTypes.UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: "organizationId"
 *      },
 *      parsedQuery: ApiQueryObject
 * }
 * ```
 * request containing the organization ID and query parameters for filtering/pagination.
 * @param {Response} res - response object to set and return employee data.
 * @param {NextFunction} next - next function to pass control to error handler.
 * @return {json}
 * ```
 * {
 *      status: 'success',
 *      results: 10, // Number of results returned in this page
 *      data: {
 *          emps: [
 *              {
 *                  role: 'Manager',
 *                  employees: {
 *                      _id: '...',
 *                      name: '...',
 *                      email: '...',
 *                  avatar: '...' },
 *                  count: 42 // Total count (only present on first element if result is not empty)
 *              },
 *              // ... other employees
 *          ],
 *          count: 42 // Total count
 *      },
 * }
 * ```
 * @author `Ravish Ranjan`
 */
export const getEmps = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { orgid } = req.params;
		if (!orgid) return next(new AppError("orgid field is requied", 404));

		const query = Emp.aggregate([
			{
				$match: {
					orgid: new Types.ObjectId(orgid),
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "userid",
					foreignField: "_id",
					as: "employees",
				},
			},
			{
				$project: {
					role: 1,
					employees: {
						_id: 1,
						name: 1,
						email: 1,
						avatar: 1,
					},
				},
			},
			{
				$unwind: {
					path: "$employees",
					preserveNullAndEmptyArrays: false,
				},
			},
			{
				$facet: {
					data: [],
					totalCount: [{ $count: "count" }],
				},
			},
			{
				$project: {
					data: 1,
					count: { $arrayElemAt: ["$totalCount.count", 0] },
				},
			},
			{
				$unwind: {
					path: "$data",
				},
			},
		]);
		const totalCount: number = await Emp.countDocuments({ orgid });
		const emps = await new ApiFilter(query, req.parsedQuery!)
			.filter()
			.sort()
			.project()
			.paginate(totalCount).query;

		if (emps)
			return res.status(200).json({
				status: "success",
				results: emps.length,
				data: {
					emps,
					count: emps[0]?.count,
				},
			});
		else {
			return res.status(200).json({
				status: "success",
				data: {
					emps: [],
				},
			});
		}
	}
);

/**
 * @brief Controller Function to retrieve all organizations the logged-in user is a part of.
 * @param {UserRequest} req
 * ```
 * {
 *      user: {
 *          _id: 'user_mongo_id' // Attached by preceding protection middleware
 *      }
 * }
 * ```
 * request containing the user ID after successful authentication
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect sends a 200 JSON response containing the list of organizations the user belongs to, including their role in each.
 * @author `Ravish Ranjan`
 */
export const getMyOrgs = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		_next: NextFunction
	) => {
		const query = Emp.aggregate([
			{
				$match: {
					userid: new Types.ObjectId(req.user?._id),
					deleted: false,
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
		const orgs = await new ApiFilter(query, req.parsedQuery!)
			.filter()
			.sort()
			.project().query;

		return res.status(200).json({
			status: "success",
			results: orgs.length,
			data: {
				orgs: orgs.map((org: OrgType & EmpType) => {
					return {
						_id: org._id,
						name: org.name,
						description: org.description,
						type: org.type,
						role: org.role,
						owner: org.owner,
						admin: org.admin,
						slug: org.slug,
						subscription: org.subscription,
						totalEmployees: org.totalEmployees,
						createdAt: org.createdAt,
						updatesAt: org.updatedAt,
					};
				}),
			},
		});
	}
);

/**
 * @brief Controller Function to change the role of an employee within a specific organization.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      },
 *      body: {
 *          newRole: 'Staff' | 'Manager' | 'Admin',
 *          userid: 'target_employee_mongo_id'
 *      }
 * }
 * ```
 * request containing the organization ID in params and the new role/user ID in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Updates the 'role' and 'manager' fields of the target Employee document and potentially:
 * - Updates the 'admin' field on the Organization document.
 * - Updates the 'manager' field on multiple subordinate Employee documents if a Manager is demoted.
 * @author `Ravish Ranjan`
 */
export const changeRole = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { newRole, userid } = req.body;
		const { orgid } = req.params;
		if (!newRole || !userid || !orgid)
			return next(new AppError("Necessary fields not found", 404));

		const org = await Org.findOne({ _id: orgid, deleted: false });
		if (!org) return next(new AppError("No organization found", 404));

		const userData = await User.findOne({
			_id: userid,
			deleted: false,
		});
		if (!userData)
			return next(new AppError("Employee can't be found", 404));

		const oldEmp = await Emp.findOne({
			orgid: org._id,
			userid: userData._id,
			deleted: false,
		});
		if (!oldEmp) return next(new AppError("Not an existing employee", 404));

		// * till now user exists and emp is of the given org
		const newEmpRole = newRole.trim();
		if (newEmpRole === "Manager") {
			switch (oldEmp.role) {
				case "Staff": {
					// ? from staff to manager
					oldEmp.role = "Manager";
					oldEmp.manager = org.owner;
					await oldEmp.save();
					return returnChangedRoleEmp(oldEmp, res);
				}
				case "Manager": {
					// ? from Manager to Manager
					return next(
						new AppError("Employee is already a manager", 400)
					);
				}
				case "Admin": {
					// ? from Admin to Manager
					oldEmp.role = "Manager";
					await oldEmp.save();
					org.admin = null;
					await org.save();
					return returnChangedRoleEmp(oldEmp, res);
				}
				default: {
					// ? invalid emp role
					return next(
						new AppError("Employee's role can't be changed", 400)
					);
				}
			}
		} else if (newEmpRole === "Staff") {
			switch (oldEmp.role) {
				case "Staff": {
					// ? from Staff to Staff
					return next(
						new AppError("Employee is already a staff", 400)
					);
				}
				case "Admin": {
					// ? from Admin to Staff
					oldEmp.role = "Staff";
					await oldEmp.save();
					org.admin = null;
					await org.save();
					return returnChangedRoleEmp(oldEmp, res);
				}
				case "Manager": {
					// ? from Manager to Staff
					// ? changed manager of all emp under user to null
					await Emp.updateMany(
						{
							manager: userData._id,
							orgid: org._id,
							deleted: false,
						},
						{ manager: null }
					);
					oldEmp.role = "Staff";
					oldEmp.manager = undefined;
					await oldEmp.save();
					return returnChangedRoleEmp(oldEmp, res);
				}
				default:
					return next(
						new AppError("Employee's role can't be changed", 400)
					);
			}
		} else if (newEmpRole === "Admin") {
			switch (oldEmp.role) {
				case "Staff": {
					// ? from Staff to Admin
					if (org.admin)
						return next(
							new AppError(
								"Organization already have a admin",
								400
							)
						);
					oldEmp.role = "Admin";
					oldEmp.manager = org.owner;
					await oldEmp.save();
					org.admin = userData._id;
					await org.save();
					return returnChangedRoleEmp(oldEmp, res);
				}
				case "Admin": {
					// ? from Admin to Admin
					return next(
						new AppError("Employee is already a admin", 400)
					);
				}
				case "Manager": {
					// ? from Manager to Admin
					if (org.admin)
						return next(
							new AppError(
								"Organiation already have a admin",
								400
							)
						);
					// ? changed manager of all emp under user to null
					await Emp.updateMany(
						{
							manager: userData._id,
							orgid: org._id,
							deleted: false,
						},
						{ manager: null }
					);
					oldEmp.role = "Admin";
					oldEmp.manager = org.owner;
					await oldEmp.save();
					org.admin = userData._id;
					await org.save();
					return returnChangedRoleEmp(oldEmp, res);
				}
				default:
					return next(
						new AppError("Employee's role can't be changed", 400)
					);
			}
		}

		return next(new AppError("Not a valid role change", 400));
	}
);

/**
 * @brief Controller Function to change the direct manager for a specific employee within an organization.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      },
 *      body: {
 *          userid: 'target_employee_mongo_id',
 *          managerEmail: 'new_manager_email'
 *      }
 * }
 * ```
 * request containing the organization ID in params and the employee/manager details in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Updates the 'manager' field on the target Employee document.
 * @author `Ravish Ranjan`
 */
export const changeManager = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { userid, managerEmail } = req.body;
		const { orgid } = req.params;
		if (!userid || !managerEmail || !orgid)
			return next(new AppError("All fields are required", 404));

		// ? check if the given emp is as emp or not
		const oldEmp = await Emp.findOne({ userid, orgid, deleted: false });
		if (!oldEmp) return next(new AppError("Employee not found", 404));

		// ? check if given manageremail has a user or not
		const managerUserData = await User.findOne({
			email: managerEmail,
			deleted: false,
		});
		if (!managerUserData)
			return next(new AppError("No such user found", 404));

		// ? check if given manager can manager other or not
		const oldManager = await Emp.findOne({
			userid: managerUserData._id,
			orgid,
			$or: [{ role: "Manager" }, { role: "Owner" }],
			deleted: false,
		});
		if (!oldManager)
			return next(
				new AppError(
					"Given Manager is neither a manager nor owner (change thier role first)",
					404
				)
			);

		// * now user is their & manager is their and manager can have emp under them
		oldEmp.manager = oldManager.userid;
		await oldEmp.save();

		return res.status(200).json({
			status: "success",
			data: {
				emp: {
					userid: oldEmp.userid,
					orgid: oldEmp.orgid,
					role: oldEmp.role,
					manager: oldEmp.manager,
					createdAt: oldEmp.createdAt,
					updatedAt: oldEmp.updatedAt,
				},
			},
		});
	}
);

/**
 * @brief Controller Function to remove a Staff employee from an organization.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      },
 *      body: {
 *          userid: 'target_employee_mongo_id'
 *      }
 * }
 * ```
 * request containing the organization ID in params and the target employee ID in the body.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Permanently deletes the Employee document from the database.
 * @author `Ravish Ranjan`
 */
export const deleteEmp = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { userid } = req.body;
		const { orgid } = req.params;
		if (!userid || !orgid)
			return next(new AppError("User and Org info is required", 404));

		const org = await Org.findOne({ _id: orgid, deleted: false });
		if (!org)
			return next(
				new AppError("Only owner/admin can change manager", 403)
			);

		const oldEmp = await Emp.findOne({
			userid,
			orgid,
			deleted: false,
		});
		console.log(oldEmp);
		if (!oldEmp)
			return next(new AppError("User id not an employee of org", 400));
		if (oldEmp.role === "Owner" || oldEmp.role === "Manager")
			return next(
				new AppError(
					"Can't remove employee with others working under them",
					400
				)
			);

		await oldEmp.delete();

		return res.status(204).end();
	}
);

/**
 * @brief Controller Function to search for employees within a specific organization by name, email, or role, utilizing Redis caching for performance.
 * @param {UserRequest} req
 * ```
 * {
 *      params: {
 *          orgid: 'organization_mongo_id'
 *      },
 *      query: {
 *          query: 'search_term' // The term to search for (e.g., 'John', 'manager', 'jdoe@')
 *      }
 * }
 * ```
 * request containing the organization ID in params and an optional search query in query parameters.
 * @param {ExpressRexponse} res - response to set and return response to
 * @param {ExpressNextFunction} next - next function to chain request
 * @return NA
 * @sideEffect Reads/writes employee data to the Redis cache for the given organization ID.
 * @author `Gaurang Tyagi`
 */
export const searchEmployee = catchAsync(
	async (
		req: ExpressTypes.UserRequest,
		res: Response,
		next: NextFunction
	) => {
		const { orgid } = req.params;
		let query = String(req.query.query || "");
		query = query.replaceAll("'", "");

		if (!orgid) return next(new AppError("Invalid organization", 400));

		let employees;
		const regex = new RegExp(`.*${query}.*`, "i");
		if (redisClient.isReady) {
			employees = await redisClient.hGet(
				`organization-${orgid}`,
				"employees"
			);
			if (employees && query.length) {
				employees = JSON.parse(employees);
				employees = employees.filter((employee: any) => {
					const employeeStr = JSON.stringify(employee);
					return regex.test(employeeStr);
				});
			}
			if (!employees || !employees.length || !query.length) {
				employees = await Emp.aggregate([
					{
						$match: {
							orgid: new Types.ObjectId(orgid),
							deleted: false,
						},
					},
					{
						$lookup: {
							from: "users",
							localField: "userid",
							foreignField: "_id",
							as: "employees",
						},
					},
					{
						$project: {
							role: 1,
							employees: {
								_id: 1,
								name: 1,
								email: 1,
								avatar: 1,
							},
						},
					},
					{
						$unwind: "$employees",
					},
					{
						$match: {
							$or: [
								{
									"employees.email": {
										$regex: `.*${query}.*`,
										$options: "i",
									},
								},
								{
									"employees.name": {
										$regex: `.*${query}.*`,
										$options: "i",
									},
								},
								{
									role: {
										$regex: `.*${query}.*`,
										$options: "i",
									},
								},
							],
						},
					},
				]);
				const employeesStr = JSON.stringify(employees);
				await redisClient.hSet(
					`organization-${orgid}`,
					"employees",
					employeesStr
				);
			}
		} else {
			employees = await Emp.aggregate([
				{
					$match: {
						orgid: new Types.ObjectId(orgid),
						deleted: false,
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "userid",
						foreignField: "_id",
						as: "employees",
					},
				},
				{
					$project: {
						role: 1,
						employees: {
							_id: 1,
							name: 1,
							email: 1,
							avatar: 1,
						},
					},
				},
				{
					$unwind: "$employees",
				},
				{
					$match: {
						$or: [
							{
								"employees.email": {
									$regex: `.*${query}.*`,
									$options: "i",
								},
							},
							{
								"employees.name": {
									$regex: `.*${query}.*`,
									$options: "i",
								},
							},
							{
								role: {
									$regex: `.*${query}.*`,
									$options: "i",
								},
							},
						],
					},
				},
			]);
		}
		return res.status(200).json({
			status: "Success",
			data: {
				employees,
			},
		});
	}
);
