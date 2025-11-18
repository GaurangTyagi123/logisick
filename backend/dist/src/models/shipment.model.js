"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const app_1 = require("../app");
/**
 * @brief Shipment mongoose schema
 * @author `Gaurang Tyagi`
 */
const shipmentSchema = new mongoose_1.Schema({
    item: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'Item',
        required: [true, 'Order must have an item'],
    },
    orderName: {
        type: String,
    },
    organizationId: {
        type: mongoose_1.Schema.ObjectId,
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
}, { timestamps: true });
shipmentSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
shipmentSchema.index({
    orderName: 1,
});
shipmentSchema.pre('save', function (next) {
    const orderName = `ORD-${new Date().toLocaleDateString()}`;
    this.orderName = orderName;
    next();
});
shipmentSchema.post(['save', 'findOneAndDelete', 'deleteOne'], async function () {
    if (app_1.redisClient.isReady) {
        const prefix = 'organization*';
        let cursor = '0';
        do {
            const result = await app_1.redisClient.scan(cursor.toString(), {
                MATCH: prefix,
                COUNT: 10,
            });
            cursor = result.cursor;
            const keys = result.keys;
            if (keys.length > 0) {
                await app_1.redisClient.del(keys);
            }
        } while (cursor !== '0');
    }
});
const shipmentModel = (0, mongoose_1.model)('Shipment', shipmentSchema);
exports.default = shipmentModel;
