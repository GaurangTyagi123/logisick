import { Schema, model, Model, Types } from 'mongoose';
import organizationModel from './organization.model';
import MongooseDelete from 'mongoose-delete';

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

employeeSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
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
employeeSchema.post('save', function () {
    (this.constructor as EmpModel).calcNumberOfEmployees(this.orgid as string);
});


const employeeModel = model<EmpDocument, EmpModel>('Employee', employeeSchema);
export default employeeModel;
