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

const shipmentSchema = new Schema<any, ShipmentModel>({
    items: [
        {
            type: Schema.ObjectId,
            ref: 'Item',
            required: true,
        },
    ],
    transferQuantites: {
        type: Number,
        required: [true, 'Specify quantity to be exported'],
    },
});

shipmentSchema.plugin(MongooseDelete as any, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});

const shipmentModel = model('Shipment', shipmentSchema);
export default shipmentModel;
