import { Model, Schema, model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface shipmentDocument extends shipmentType, Document {
    delete(): Promise<shipmentDocument>; // soft delete
    restore(): Promise<shipmentDocument>; // restore soft-deleted doc
}
export interface ShipmentModel extends Model<shipmentDocument> {
    findWithDeleted(conditions?: any): Promise<shipmentDocument[]>;
    findDeleted(conditions?: any): Promise<shipmentDocument[]>;
    delete(conditions: any): Promise<any>;
    deleteById(id: string): Promise<any>;
}

/**
 * @brief Shipment mongoose schema
 * @author `Gaurang Tyagi`
 */
const shipmentSchema = new Schema<any, ShipmentModel>(
    {
        item: {
            type: Schema.ObjectId,
            ref: 'Item',
            required: [true, 'Order must have an item'],
        },
        orderName: {
            type: String,
        },
        organizationId: {
            type: Schema.ObjectId,
            ref: 'Organization',
            required: [true, 'Order must belong to an organization'],
        },
        quantity: {
            type: Number,
            required: [true, 'Specify quantity to be exported/imported'],
        },
        orderedOn: {
            type: Date,
            default: () => new Date().toISOString().split('T')[0],
        },
        shipped: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

shipmentSchema.plugin(MongooseDelete as any, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});

shipmentSchema.index({
    orderName: 1,
});

shipmentSchema.pre('save', function (next: any) {
    const orderName = `ORD-${new Date().toLocaleDateString()}`;
    this.orderName = orderName;
    next();
});

const shipmentModel = model('Shipment', shipmentSchema);
export default shipmentModel;