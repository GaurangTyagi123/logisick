"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchEmployee = exports.deleteEmp = exports.changeManager = exports.changeRole = exports.getMyOrgs = exports.getEmps = exports.joinOrg = exports.sendInvite = void 0;
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const organization_model_1 = __importDefault(require("../models/organization.model"));
const employee_model_1 = __importDefault(require("../models/employee.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_1 = __importDefault(require("../utils/appError"));
const crypto_1 = __importDefault(require("crypto"));
const app_1 = require("../app");
const sendEmail_1 = __importDefault(require("../utils/sendEmail"));
const mongoose_1 = require("mongoose");
const apiFilter_1 = __importDefault(require("../utils/apiFilter"));
/**
 * @brief function to return emp data after role change
 * @param {EmpType} emp - employee's data
 * @param {Response} res - express response object
 * @returns data in response
 * @author `Ravish Ranjan`
 */
function returnChangedRoleEmp(emp, res) {
    return res.status(200).json({
        status: 'success',
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
exports.sendInvite = (0, catchAsync_1.default)(async (req, res, next) => {
    let { empEmail, role } = req.body;
    if (!empEmail || !role)
        return next(new appError_1.default('All fields are required', 404));
    empEmail = empEmail.trim();
    role = role.trim();
    const org = await organization_model_1.default.findOne({
        $or: [{ owner: req.user?._id }, { admin: req.user?._id }],
    });
    if (!org)
        return next(new appError_1.default('No organization to add employee to', 404));
    const isOldUser = await user_model_1.default.findOne({ email: empEmail });
    if (isOldUser) {
        const isOldEmp = await employee_model_1.default.findOne({
            orgid: org._id,
            userid: isOldUser._id,
        });
        if (isOldEmp)
            return next(new appError_1.default('Invited user is already an employee', 404));
    }
    const alreadyInvited = await app_1.redisClient.hGet(empEmail, 'token');
    if (alreadyInvited)
        return next(new appError_1.default('Already invited', 200));
    const inviteToken = crypto_1.default.randomBytes(32).toString('hex');
    if (!['Manager', 'Staff', 'Admin'].includes(role))
        return next(new appError_1.default('Not a valid role', 400));
    await app_1.redisClient.hSet(empEmail, {
        token: inviteToken,
        orgid: org._id.toString(),
        role,
    });
    const exists = await app_1.redisClient.exists(empEmail);
    if (!exists)
        return next(new appError_1.default('Unable to save invite ', 500));
    const expireTime = await app_1.redisClient.expire(empEmail, parseInt(process.env.OTP_EXPIRE_TIME) *
        24 *
        60 *
        60 *
        1000);
    if (expireTime !== 1) {
        return next(new appError_1.default('Failed to generate and save invite token', 500));
    }
    const url = `${process.env.FRONTEND_URL}/acceptInvite/${inviteToken}`;
    await new sendEmail_1.default({
        userName: req.user?.name,
        email: req.user?.email,
        orgName: org.name,
        role,
    }, url).sendOrgInviteLink();
    res.status(200).json({
        status: 'success',
        data: {
            message: 'invite sent successfully',
        },
    });
});
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
exports.joinOrg = (0, catchAsync_1.default)(async (req, res, next) => {
    const { token } = req.body;
    if (!token)
        return next(new appError_1.default('Token not found', 404));
    if (!req.user)
        return next(new appError_1.default('Unauthenticated', 400));
    if (!req.user.isVerified)
        return next(new appError_1.default('User have to be verified to join organiation', 403));
    const { token: inviteToken, orgid, role, } = await app_1.redisClient.hGetAll(req.user.email);
    if (!role || !orgid || !inviteToken || token.trim() !== inviteToken)
        return next(new appError_1.default('User not invited in organization', 400));
    const newEmpData = {
        userid: req.user._id,
        orgid,
        role,
    };
    const newEmp = await employee_model_1.default.create(newEmpData);
    if (!newEmp)
        return next(new appError_1.default('Error adding new Employee', 500));
    await app_1.redisClient.del(req.user?.email);
    return res.status(201).json({
        status: 'success',
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
});
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
exports.getEmps = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    if (!orgid)
        return next(new appError_1.default('orgid field is requied', 404));
    const query = employee_model_1.default.aggregate([
        {
            $match: {
                orgid: new mongoose_1.Types.ObjectId(orgid),
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: 'userid',
                foreignField: '_id',
                as: 'employees',
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
                path: '$employees',
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $facet: {
                data: [],
                totalCount: [{ $count: 'count' }],
            },
        },
        {
            $project: {
                data: 1,
                count: { $arrayElemAt: ['$totalCount.count', 0] },
            },
        },
        {
            $unwind: {
                path: '$data',
            },
        },
    ]);
    const totalCount = await employee_model_1.default.countDocuments({ orgid });
    const emps = await new apiFilter_1.default(query, req.parsedQuery)
        .filter()
        .sort()
        .project()
        .paginate(totalCount).query;
    if (emps)
        return res.status(200).json({
            status: 'success',
            results: emps.length,
            data: {
                emps,
                count: emps[0]?.count,
            },
        });
    else {
        return res.status(200).json({
            status: 'success',
            data: {
                emps: [],
            },
        });
    }
});
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
exports.getMyOrgs = (0, catchAsync_1.default)(async (req, res, _next) => {
    const query = employee_model_1.default.aggregate([
        {
            $match: {
                userid: new mongoose_1.Types.ObjectId(req.user?._id),
                deleted: false,
            },
        },
        {
            $lookup: {
                from: 'organizations',
                localField: 'orgid',
                foreignField: '_id',
                as: 'organizationDetails',
            },
        },
        {
            $unwind: {
                path: '$organizationDetails',
                preserveNullAndEmptyArrays: false,
            },
        },
        {
            $match: {
                'organizationDetails.deleted': false,
            },
        },
        {
            $replaceRoot: {
                newRoot: {
                    $mergeObjects: [
                        '$organizationDetails',
                        { role: '$role' },
                    ],
                },
            },
        },
    ]);
    const orgs = await new apiFilter_1.default(query, req.parsedQuery)
        .filter()
        .sort()
        .project().query;
    return res.status(200).json({
        status: 'success',
        results: orgs.length,
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
                    slug: org.slug,
                    subscription: org.subscription,
                    totalEmployees: org.totalEmployees,
                    createdAt: org.createdAt,
                    updatesAt: org.updatedAt,
                };
            }),
        },
    });
});
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
exports.changeRole = (0, catchAsync_1.default)(async (req, res, next) => {
    const { newRole, userid } = req.body;
    const { orgid } = req.params;
    if (!newRole || !userid || !orgid)
        return next(new appError_1.default('Necessary fields not found', 404));
    const org = await organization_model_1.default.findOne({ _id: orgid, deleted: false });
    if (!org)
        return next(new appError_1.default('No organization found', 404));
    const userData = await user_model_1.default.findOne({
        _id: userid,
        deleted: false,
    });
    if (!userData)
        return next(new appError_1.default("Employee can't be found", 404));
    const oldEmp = await employee_model_1.default.findOne({
        orgid: org._id,
        userid: userData._id,
        deleted: false,
    });
    if (!oldEmp)
        return next(new appError_1.default('Not an existing employee', 404));
    // * till now user exists and emp is of the given org
    const newEmpRole = newRole.trim();
    if (newEmpRole === 'Manager') {
        switch (oldEmp.role) {
            case 'Staff': {
                // ? from staff to manager
                oldEmp.role = 'Manager';
                oldEmp.manager = org.owner;
                await oldEmp.save();
                return returnChangedRoleEmp(oldEmp, res);
            }
            case 'Manager': {
                // ? from Manager to Manager
                return next(new appError_1.default('Employee is already a manager', 400));
            }
            case 'Admin': {
                // ? from Admin to Manager
                oldEmp.role = 'Manager';
                await oldEmp.save();
                org.admin = null;
                await org.save();
                return returnChangedRoleEmp(oldEmp, res);
            }
            default: {
                // ? invalid emp role
                return next(new appError_1.default("Employee's role can't be changed", 400));
            }
        }
    }
    else if (newEmpRole === 'Staff') {
        switch (oldEmp.role) {
            case 'Staff': {
                // ? from Staff to Staff
                return next(new appError_1.default('Employee is already a staff', 400));
            }
            case 'Admin': {
                // ? from Admin to Staff
                oldEmp.role = 'Staff';
                await oldEmp.save();
                org.admin = null;
                await org.save();
                return returnChangedRoleEmp(oldEmp, res);
            }
            case 'Manager': {
                // ? from Manager to Staff
                // ? changed manager of all emp under user to null
                await employee_model_1.default.updateMany({
                    manager: userData._id,
                    orgid: org._id,
                    deleted: false,
                }, { manager: null });
                oldEmp.role = 'Staff';
                oldEmp.manager = undefined;
                await oldEmp.save();
                return returnChangedRoleEmp(oldEmp, res);
            }
            default:
                return next(new appError_1.default("Employee's role can't be changed", 400));
        }
    }
    else if (newEmpRole === 'Admin') {
        switch (oldEmp.role) {
            case 'Staff': {
                // ? from Staff to Admin
                if (org.admin)
                    return next(new appError_1.default('Organization already have a admin', 400));
                oldEmp.role = 'Admin';
                oldEmp.manager = org.owner;
                await oldEmp.save();
                org.admin = userData._id;
                await org.save();
                return returnChangedRoleEmp(oldEmp, res);
            }
            case 'Admin': {
                // ? from Admin to Admin
                return next(new appError_1.default('Employee is already a admin', 400));
            }
            case 'Manager': {
                // ? from Manager to Admin
                if (org.admin)
                    return next(new appError_1.default('Organiation already have a admin', 400));
                // ? changed manager of all emp under user to null
                await employee_model_1.default.updateMany({
                    manager: userData._id,
                    orgid: org._id,
                    deleted: false,
                }, { manager: null });
                oldEmp.role = 'Admin';
                oldEmp.manager = org.owner;
                await oldEmp.save();
                org.admin = userData._id;
                await org.save();
                return returnChangedRoleEmp(oldEmp, res);
            }
            default:
                return next(new appError_1.default("Employee's role can't be changed", 400));
        }
    }
    return next(new appError_1.default('Not a valid role change', 400));
});
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
exports.changeManager = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userid, managerEmail } = req.body;
    const { orgid } = req.params;
    if (!userid || !managerEmail || !orgid)
        return next(new appError_1.default('All fields are required', 404));
    // ? check if the given emp is as emp or not
    const oldEmp = await employee_model_1.default.findOne({ userid, orgid, deleted: false });
    if (!oldEmp)
        return next(new appError_1.default('Employee not found', 404));
    // ? check if given manageremail has a user or not
    const managerUserData = await user_model_1.default.findOne({
        email: managerEmail,
        deleted: false,
    });
    if (!managerUserData)
        return next(new appError_1.default('No such user found', 404));
    // ? check if given manager can manager other or not
    const oldManager = await employee_model_1.default.findOne({
        userid: managerUserData._id,
        orgid,
        $or: [{ role: 'Manager' }, { role: 'Owner' }],
        deleted: false,
    });
    if (!oldManager)
        return next(new appError_1.default('Given Manager is neither a manager nor owner (change thier role first)', 404));
    // * now user is their & manager is their and manager can have emp under them
    oldEmp.manager = oldManager.userid;
    await oldEmp.save();
    return res.status(200).json({
        status: 'success',
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
});
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
exports.deleteEmp = (0, catchAsync_1.default)(async (req, res, next) => {
    const { userid } = req.body;
    const { orgid } = req.params;
    if (!userid || !orgid)
        return next(new appError_1.default('User and Org info is required', 404));
    const org = await organization_model_1.default.findOne({ _id: orgid, deleted: false });
    if (!org)
        return next(new appError_1.default('Only owner/admin can change manager', 403));
    const oldEmp = await employee_model_1.default.findOne({
        userid,
        orgid,
        deleted: false,
    });
    console.log(oldEmp);
    if (!oldEmp)
        return next(new appError_1.default('User id not an employee of org', 400));
    if (oldEmp.role === 'Owner' || oldEmp.role === 'Manager')
        return next(new appError_1.default("Can't remove employee with others working under them", 400));
    await oldEmp.delete();
    return res.status(204).end();
});
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
exports.searchEmployee = (0, catchAsync_1.default)(async (req, res, next) => {
    const { orgid } = req.params;
    let query = String(req.query.query || '');
    query = query.replaceAll("'", '');
    if (!orgid)
        return next(new appError_1.default('Invalid organization', 400));
    let employees;
    const regex = new RegExp(`.*${query}.*`, 'i');
    if (app_1.redisClient.isReady) {
        employees = await app_1.redisClient.hGet(`organization-${orgid}`, 'employees');
        if (employees && query.length) {
            employees = JSON.parse(employees);
            employees = employees.filter((employee) => {
                const employeeStr = JSON.stringify(employee);
                return regex.test(employeeStr);
            });
        }
        if (!employees || !employees.length || !query.length) {
            employees = await employee_model_1.default.aggregate([
                {
                    $match: {
                        orgid: new mongoose_1.Types.ObjectId(orgid),
                        deleted: false,
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userid',
                        foreignField: '_id',
                        as: 'employees',
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
                    $unwind: '$employees',
                },
                {
                    $match: {
                        $or: [
                            {
                                'employees.email': {
                                    $regex: `.*${query}.*`,
                                    $options: 'i',
                                },
                            },
                            {
                                'employees.name': {
                                    $regex: `.*${query}.*`,
                                    $options: 'i',
                                },
                            },
                            {
                                role: {
                                    $regex: `.*${query}.*`,
                                    $options: 'i',
                                },
                            },
                        ],
                    },
                },
            ]);
            const employeesStr = JSON.stringify(employees);
            await app_1.redisClient.hSet(`organization-${orgid}`, 'employees', employeesStr);
        }
    }
    else {
        employees = await employee_model_1.default.aggregate([
            {
                $match: {
                    orgid: new mongoose_1.Types.ObjectId(orgid),
                    deleted: false,
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userid',
                    foreignField: '_id',
                    as: 'employees',
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
                $unwind: '$employees',
            },
            {
                $match: {
                    $or: [
                        {
                            'employees.email': {
                                $regex: `.*${query}.*`,
                                $options: 'i',
                            },
                        },
                        {
                            'employees.name': {
                                $regex: `.*${query}.*`,
                                $options: 'i',
                            },
                        },
                        {
                            role: {
                                $regex: `.*${query}.*`,
                                $options: 'i',
                            },
                        },
                    ],
                },
            },
        ]);
    }
    return res.status(200).json({
        status: 'Success',
        data: {
            employees,
        },
    });
});
