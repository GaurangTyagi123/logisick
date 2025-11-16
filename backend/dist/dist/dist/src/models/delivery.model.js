"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
/**
 * @brief Delivery mongoose schema
 * @author `Gaurang Tyagi`
 */
const deliverySchema = new mongoose_1.Schema({
    fromOrganization: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'Organization'
    },
    toOrganization: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'Organization'
    },
    shipmentId: mongoose_1.Schema.ObjectId,
    startDate: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: String,
        enum: ['shipped', 'in-transit', 'out-for-delivery', 'Delivered']
    },
    trackUrl: String,
    ETA: {
        type: Date,
        required: [true, 'Delivery must have an expected time of delivery']
    }
});
/**
 * @brief adding soft delete plugin
 * @author `Gaurang Tyagi`
 */
deliverySchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all'
});
const deliveryModel = (0, mongoose_1.model)('Delivery', deliverySchema);
exports.default = deliveryModel;
