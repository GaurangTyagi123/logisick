"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const organization_model_1 = __importDefault(require("./organization.model"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const app_1 = require("../app");
/**
 * @brief Employees mongoose schema
 * @author `Gaurang Tyagi`
 */
const employeeSchema = new mongoose_1.Schema({
    userid: {
        type: mongoose_1.Schema.ObjectId,
        required: [true, 'Employee have to be user first'],
        ref: 'User',
    },
    orgid: {
        type: mongoose_1.Schema.ObjectId,
        required: [true, 'Organization is required for employee'],
        ref: 'Organization',
    },
    role: {
        type: String,
        enum: ['Owner', 'Admin', 'Manager', 'Staff'],
        default: 'staff',
        required: [true, 'Employee must have a role in organization'],
    },
    manager: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });
// mongoose delete plugin to implement soft delete
employeeSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
// static method of employee schema which actually calculate the total number of employees
/**
 * @param orgid
 * @brief calculate the total number of employees belonging to organization with ID:orgid
 * @description It uses aggregate pipeline which includes:
 *          $match stage to find all the employees belonging to organization with ID:orgid
 *          $group stage  to group the result of match stage and calculate the number of employees
 * @author `Gaurang Tyagi``
 */
employeeSchema.statics.calcNumberOfEmployees = async function (orgid) {
    const stats = await this.aggregate([
        {
            $match: {
                orgid: new mongoose_1.Types.ObjectId(orgid),
                deleted: false,
            },
        },
        {
            $group: {
                _id: '$orgid',
                members: { $sum: 1 },
            },
        },
    ]);
    if (stats && stats?.length) {
        await organization_model_1.default.findByIdAndUpdate(orgid, {
            totalEmployees: stats[0]?.members,
        });
    }
};
// Setting by default that manager od a manager should be the owner
employeeSchema.pre('save', async function (next) {
    try {
        if ((this.role === 'Manager' || this.role === 'Admin') &&
            !this.manager) {
            const org = await organization_model_1.default.findById(this.orgid);
            if (org && org.owner) {
                this.manager = org.owner;
            }
        }
        next();
    }
    catch (error) {
        next(error);
    }
});
// middleware to calculate the total number of employees after insertion of an employee
employeeSchema.post(['save', 'findOneAndDelete', 'deleteOne'], function (doc) {
    this.constructor.calcNumberOfEmployees(doc.orgid);
    if (app_1.redisClient.isReady)
        app_1.redisClient.del(`organization-${doc.orgid}`);
});
const employeeModel = (0, mongoose_1.model)('Employee', employeeSchema);
exports.default = employeeModel;
