import { Schema, model, Model, Types } from 'mongoose';
import organizationModel from './organization.model';
import MongooseDelete from 'mongoose-delete';
import { redisClient } from '../app';

export interface EmpDocument extends EmpType, Document {
    delete(): Promise<EmpDocument>; // soft delete
    restore(): Promise<EmpDocument>; // restore soft-deleted doc
}

export interface EmpModel extends Model<EmpDocument> {
    findWithDeleted(conditions?: any): Promise<EmpDocument[]>;

    findDeleted(conditions?: any): Promise<EmpDocument[]>;

    delete(conditions: any): Promise<any>;

    calcNumberOfEmployees: (orgid: string) => Promise<any>;
}

/**
 * @brief Employees mongoose schema
 * @author `Gaurang Tyagi`
 */
const employeeSchema = new Schema<any, EmpModel>(
    {
        userid: {
            type: Schema.ObjectId,
            required: [true, 'Employee have to be user first'],
            ref: 'User',
        },
        orgid: {
            type: Schema.ObjectId,
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
            type: Schema.ObjectId,
            ref: 'User',
        },
    },
    { timestamps: true }
);

// mongoose delete plugin to implement soft delete
employeeSchema.plugin(MongooseDelete, {
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
employeeSchema.statics.calcNumberOfEmployees = async function (orgid: string) {
    const stats = await this.aggregate([
        {
            $match: {
                orgid: new Types.ObjectId(orgid),
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
        await organizationModel.findByIdAndUpdate(orgid, {
            totalEmployees: stats[0]?.members,
        });
    }
};

// Setting by default that manager od a manager should be the owner
employeeSchema.pre('save', async function (this: EmpType, next) {
    try {
        if (
            (this.role === 'Manager' || this.role === 'Admin') &&
            !this.manager
        ) {
            const org = await organizationModel.findById(this.orgid);
            if (org && org.owner) {
                this.manager = org.owner;
            }
        }
        next();
    } catch (error) {
        next(error as Error);
    }
});
// middleware to calculate the total number of employees after insertion of an employee
employeeSchema.post(['save', 'findOneAndDelete','findOneAndUpdate','deleteOne'], function (doc) {
    (this.constructor as EmpModel).calcNumberOfEmployees(doc.orgid as string);
    if(redisClient.isReady)
        redisClient.del(`organization-${doc.orgid}`);   
});

const employeeModel = model<EmpDocument, EmpModel>('Employee', employeeSchema);
export default employeeModel;
