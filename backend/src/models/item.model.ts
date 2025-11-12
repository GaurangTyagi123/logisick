import { model, Schema, type Model } from 'mongoose';
import MongooseDelete from 'mongoose-delete';

export interface ItemDocument extends ItemType, Document {
    delete(): Promise<ItemDocument>; // soft delete
    restore(): Promise<ItemDocument>; // restore soft-deleted doc
}

export interface ItemModel extends Model<ItemDocument> {
    findWithDeleted(conditions?: any): Promise<ItemDocument[]>;
    findDeleted(conditions?: any): Promise<ItemDocument[]>;
    delete(conditions: any): Promise<any>;
    deleteById(id: string): Promise<any>;
}

const itemSchema = new Schema<any, ItemModel>(
    {
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        barcode: {
            type: String,
            unique: true,
        },
        name: {
            type: String,
            required: [true, 'Item must have a name'],
        },
        organizationId: {
            type: Schema.ObjectId,
            ref: 'Organization',
            required: true,
        },
        costPrice: {
            type: Number,
            required: [true, 'Item must have a cost price'],
        },
        sellingPrice: {
            type: Number,
            required: [true, 'Item must have a selling price'],
        },
        quantity: {
            type: Number,
            default: 1,
        },
        inventoryCategory: {
            type: String,
            required: [true, 'Item must have a category'],
        },
        importance: {
            type: String,
            enum: ['A', 'B', 'C'],
        },
        importedOn: {
            type: Date,
            default: Date.now(),
        },
        expiresOn: Date,
        weight: Number,
        colour: String,
        reorderLevel: Number,
        batchNumber: Number,
        origin: {
            type: String,
            default: 'India',
        },
        SKU: String,
    },
    {
        timestamps: true,
    }
);
itemSchema.index({
    SKU: 1,
});
itemSchema.index({
    '$**': 'text',
});
itemSchema.plugin(MongooseDelete, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
itemSchema.pre('save', function (this: ItemDocument, next) {
    const CAT = this.inventoryCategory.substring(0, 3).toUpperCase();
    const COL = this.colour?.substring(0, 3).toUpperCase();
    const WGT = this.weight?.toString().substring(0, 3).toUpperCase();
    const ORG = this.origin?.substring(0, 3).toUpperCase();

    const SKU = `${this._id}-${CAT}-${COL || ''}-${WGT || ''}-${ORG || ''}`;
    this.SKU = SKU;
    next();
});

const itemModel = model<ItemDocument, ItemModel>('Item', itemSchema);
export default itemModel;
