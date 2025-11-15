import { type Model, model, Schema } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface deliveryDocument extends Document,deliveryType {
    delete(): Promise<deliveryDocument>;
    restore(): Promise<deliveryDocument>;
}
export interface deliveryModel extends Model<deliveryDocument>{
    findWithDeleted(conditions?: any): Promise<deliveryDocument>;
    findDeleted(conditions?: any): Promise<deliveryDocument[]>;
    delete(conditions: any): Promise<any>;
    deleteById(id: string): Promise<any>;
}

/**
 * @brief Delivery mongoose schema
 * @author `Gaurang Tyagi`
 */
const deliverySchema = new Schema<any,deliveryModel>({
    fromOrganization: {
        type: Schema.ObjectId,
        ref : 'Organization'
    },
    toOrganization: {
        type: Schema.ObjectId,
        ref : 'Organization'
    },
    shipmentId: Schema.ObjectId,
    startDate: {
        type: Date,
        default : Date.now()
    },
    status: {
        type: String,
        enum : ['shipped','in-transit','out-for-delivery','Delivered']
    },
    trackUrl: String,
    ETA: {
        type: Date,
        required : [true,'Delivery must have an expected time of delivery']
    }
});

/**
 * @brief adding soft delete plugin
 * @author `Gaurang Tyagi` 
 */
deliverySchema.plugin(MongooseDelete as any, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all'
})


const deliveryModel = model<deliveryDocument,deliveryModel>('Delivery', deliverySchema);
export default deliveryModel;
