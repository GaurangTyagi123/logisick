import { Schema, model, Model } from 'mongoose';
import mongooseDelete from 'mongoose-delete';

export interface OrgDocument extends OrgType, Document {
    delete(): Promise<OrgDocument>; // soft delete
    restore(): Promise<OrgDocument>; // restore soft-deleted doc
}

export interface OrgModel extends Model<OrgDocument> {
    findWithDeleted(conditions?: any): Promise<OrgDocument[]>;

    findDeleted(conditions?: any): Promise<OrgDocument[]>;

    delete(conditions: any): Promise<any>;

    deleteById(id: string): Promise<any>;
}

const organizationSchema = new Schema<any, OrgModel>(
    {
        name: {
            type: String,
            required: [true, 'Organization must have a name'],
            minLength: 1,
            maxLength: 48,
        },
        description: {
            type: String,
            default: 'Your organization',
            minLength: 8,
            maxLength: 300,
        },
        type: {
            type: String,
            enum: ['Basic', 'Small-Cap', 'Mid-Cap', 'Large-Cap', 'Other'],
            required: true,
            default: 'Basic',
        },
        owner: {
            type: Schema.ObjectId,
            required: true,
            ref: 'User',
        },
        admin: {
            type: Schema.ObjectId,
            ref: 'User',
        },
        subscription: {
            type: String,
            enum: ['None', 'Basic', 'Pro'],
            required: true,
            default: 'None',
        },
    },
    { timestamps: true }
);

organizationSchema.index(
    { owner: 1 },
    { unique: true, partialFilterExpression: { deleted: { $ne: true } } }
);

// plugin for soft delete
organizationSchema.plugin(mongooseDelete, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});

const organizationModel = model<OrgDocument, OrgModel>(
    'Organization',
    organizationSchema
);
export default organizationModel;
