import type { Response, NextFunction } from 'express';
import catchAsync from '../utils/catchAsync';
import Org from '../models/organization.model';
import Emp from '../models/employee.model';
import User from '../models/user.model';
import AppError from '../utils/appError';
import crypto from 'crypto';
import { redisClient } from '../app';
import Email from '../utils/sendEmail';
import { Types } from 'mongoose';
import ApiFilter from '../utils/apiFilter';

// Function send emp invite to join org (by email id) (by owner/admin)
export const sendInvite = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        let { empEmail, role } = req.body;
        const { managerid } = req.body;
        if (!empEmail || !role)
            return next(new AppError('All fields are required', 404));
        empEmail = empEmail.trim();
        role = role.trim();
        const org = await Org.findOne({
            $or: [{ owner: req.user?._id }, { admin: req.user?._id }],
        });
        if (!org)
            return next(
                new AppError('No organization to add employee to', 404)
            );
        const isOldUser = await User.findOne({ email: empEmail });
        if (isOldUser) {
            const isOldEmp = await Emp.findOne({
                orgid: org._id,
                userid: isOldUser._id,
            });
            if (isOldEmp)
                return next(
                    new AppError('Invited user is already an employee', 404)
                );
        }

        const alreadyInvited = await redisClient.hGet(empEmail, 'token');
        if (alreadyInvited) return next(new AppError('Already invited', 200));

        const inviteToken = crypto.randomBytes(32).toString('hex');
        if (!['Manager', 'Staff', 'Admin'].includes(role))
            return next(new AppError('Not a valid role', 400));

        if (role === 'Staff' && !managerid)
            return next(new AppError('Manager is required', 400));

        if (role === 'Staff') {
            await redisClient.hSet(empEmail, {
                token: inviteToken,
                orgid: org._id.toString(),
                role,
                managerid,
            });
        } else {
            await redisClient.hSet(empEmail, {
                token: inviteToken,
                orgid: org._id.toString(),
                role,
            });
        }

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
                new AppError('Failed to generate and save invite token', 500)
            );
        }
        // TODO make it work for production
        const url = `${req.protocol}://localhost:5173/acceptInvite/${inviteToken}`;
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
            status: 'success',
            data: {
                message: 'invite sent successfully',
            },
        });
    }
);

// Function to join new employee (only by verified user)
export const joinOrg = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { token } = req.body;
        if (!token) return next(new AppError('Token not found', 404));
        if (!req.user) return next(new AppError('Unauthenticated', 400));

        if (!req.user.isVerified)
            return next(
                new AppError(
                    'User have to be verified to join organiation',
                    403
                )
            );
        const {
            token: inviteToken,
            orgid,
            role,
            managerid,
        } = await redisClient.hGetAll(req.user.email);

        if (!role || !orgid || !inviteToken || token.trim() !== inviteToken)
            return next(new AppError('User not invited in organization', 400));

        if (role == 'Staff' && !managerid)
            return next(
                new AppError('Invalid invitation (no manager assigned)', 400)
            );

        const newEmpData: {
            userid: ObjectId;
            orgid: string;
            role: string;
            manager?: string;
        } = {
            userid: req.user._id,
            orgid,
            role,
        };
        if (managerid) newEmpData.manager = managerid;
        const newEmp = await Emp.create(newEmpData);
        if (!newEmp)
            return next(new AppError('Error adding new Employee', 500));

        await redisClient.del(req.user?.email);
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
    }
);

// Function to get emps by orgid
export const getEmps = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { orgid } = req.params;
        if (!orgid) return next(new AppError('orgid field is requied', 404));

        const query = Emp.aggregate([
            {
                $match: {
                    orgid: new Types.ObjectId(orgid),
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

        const emps = await new ApiFilter(query, req.parsedQuery!)
            .filter()
            .sort()
            .project()
            .paginate().query;

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
    }
);

// Function to get organization of which i am member of
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
        const orgs = await new ApiFilter(query, req.parsedQuery!)
            .filter()
            .sort()
            .project()
            .paginate().query;

        return res.status(200).json({
            status: 'success',
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

// Function to change roles of user (by owner/admin)
export const changeRole = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { newRole, userid, managerid } = req.body;
        if (!newRole || !userid)
            return next(new AppError('Neccessary fields not found', 404));

        const org = await Org.findOne({
            $or: [{ owner: req.user?._id }, { admin: req.user?._id }],
            deleted: false,
        });
        if (!org) return next(new AppError('No organization found', 404));

        const oldEmp = await Emp.findOne({
            orgid: org._id,
            userid,
            deleted: false,
        });
        if (!oldEmp) return next(new AppError('Not an existing employee', 404));

        const dataToUpdate: {
            role?: 'Manager' | 'Staff' | 'Admin';
            manager?: ObjectId;
        } = {};

        if (newRole.trim() === 'Manager') {
            dataToUpdate.role = 'Manager';
            dataToUpdate.manager = req.user?._id;
        } else if (newRole.trim() === 'Staff') {
            dataToUpdate.role = 'Staff';
            if (!managerid)
                return next(new AppError('Manager field is required', 404));
            const isManager = await Emp.findOne({
                orgid: org._id,
                userid: managerid,
                role: 'Manager',
            });
            if (!isManager)
                return next(new AppError('Not an existing manager', 404));
            else dataToUpdate.manager = managerid;
        } else if (newRole.trim() === 'Admin') {
            if (org.owner !== req.user?._id)
                return next(
                    new AppError('Not authorised to assign admin', 403)
                );
            dataToUpdate.role = 'Admin';
            dataToUpdate.manager = req.user?._id;
        } else {
            return next(new AppError('Not a valid role change', 400));
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
        if (!newEmp) return next(new AppError('Error changing role', 500));

        return res.status(200).json({
            status: 'success',
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

// Function to change/assign manager of a staff (by owner/admin)
export const changeManager = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { userid, managerid } = req.body;
        if (!userid || !managerid)
            return next(new AppError('All fields are required', 404));

        const org = await Org.findOne({
            $or: [{ owner: req.user?._id }, { admin: req.user?._id }],
        }).lean();
        if (!org)
            return next(
                new AppError('Only owner/admin can change manager', 403)
            );

        const [isEmp, isManager] = await Promise.all([
            Emp.findOne({ userid, orgid: org._id }),
            Emp.findOne({ userid: managerid, orgid: org._id, role: 'Manager' }),
        ]);

        if (!isEmp)
            return next(new AppError('User is not in organization', 400));
        if (!isManager)
            return next(new AppError('Manager is not in organization', 400));

        const managerManager = await Emp.findOne({
            userid: req.user?._id,
            orgid: org._id,
            role: 'Owner',
        });

        if (!managerManager)
            return next(
                new AppError('New manager is not reporting to owner', 400)
            );

        const newEmp = await Emp.findOneAndUpdate(
            {
                userid,
                orgid: org._id,
                deleted: false,
            },
            { $set: { manager: managerid } },
            { new: true }
        );

        if (!newEmp) return next(new AppError('Error changing role', 500));

        return res.status(200).json({
            status: 'success',
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

// Function to delete employee
export const deleteEmp = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { userid } = req.body;
        if (!userid) return next(new AppError('User is required field', 404));

        const org = await Org.findOne({
            $or: [{ owner: req.user?._id }, { admin: req.user?._id }],
        }).lean();
        if (!org)
            return next(
                new AppError('Only owner/admin can change manager', 403)
            );

        const oldEmp = await Emp.findOne({
            userid,
            orgid: org._id,
            deleted: { $ne: true },
        });
        if (!oldEmp)
            return next(new AppError('User id not an employee of org', 400));
        if (oldEmp.role === 'Owner' || oldEmp.role === 'Manager')
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
export const searchEmployee = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: Response,
        next: NextFunction
    ) => {
        const { orgid } = req.params;
        let query = String(req.query.query || '');
        query = query.replaceAll("'", '');

        if (!orgid) return next(new AppError('Invalid organization', 400));

        let employees;
        if (redisClient.isReady) {
            employees = await redisClient.hGet(
                `organization-${orgid}`,
                'employees'
            );
            if (!employees) {
                employees = await Emp.aggregate([
                    {
                        $match: {
                            orgid: new Types.ObjectId(orgid),
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
                await redisClient.hSet(
                    `organization-${orgid}`,
                    'employees',
                    JSON.stringify(employees)
                );
                console.log(employees)
            }
            else {
                employees = JSON.parse(employees)
            }
        }
        else {
            employees = await Emp.aggregate([
                    {
                        $match: {
                            orgid: new Types.ObjectId(orgid),
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
    }
);
