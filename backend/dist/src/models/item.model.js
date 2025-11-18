"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const app_1 = require("../app");
/**
 * @brief Items mongoose schema
 * @author `Gaurang Tyagi`
 */
const itemSchema = new mongoose_1.Schema({
    createdAt: {
        type: Date,
        default: Date.now(),
    },
    name: {
        type: String,
        required: [true, 'Item must have a name'],
    },
    organizationId: {
        type: mongoose_1.Schema.ObjectId,
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
}, {
    timestamps: true,
});
itemSchema.index({
    SKU: 1,
});
itemSchema.index({
    '$**': 'text',
});
itemSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
/**
 * @brief function to genereate sku on save of document
 * @author `Gaurang Tyagi``
 */
itemSchema.pre('save', function (next) {
    const CAT = this.inventoryCategory.substring(0, 3).toUpperCase();
    const COL = this.colour?.substring(0, 3).toUpperCase();
    const WGT = this.weight?.toString().substring(0, 3).toUpperCase();
    const ORG = this.origin?.substring(0, 3).toUpperCase();
    const SKU = `${this._id}-${CAT}-${COL || ''}-${WGT || ''}-${ORG || ''}`;
    this.SKU = SKU;
    next();
});
itemSchema.post(['save', 'findOneAndDelete', 'deleteOne'], async function (doc) {
    if (app_1.redisClient.isReady) {
        await app_1.redisClient.del(`organization-${doc.organizationId}`);
    }
});
const itemModel = (0, mongoose_1.model)('Item', itemSchema);
exports.default = itemModel;
