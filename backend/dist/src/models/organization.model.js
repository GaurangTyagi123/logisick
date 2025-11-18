"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
const slugify_1 = __importDefault(require("slugify"));
const nanoid_1 = require("nanoid");
/**
 * @brief Organization mongoose schema
 */
const organizationSchema = new mongoose_1.Schema({
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
    totalEmployees: {
        type: Number,
        default: 0,
    },
    type: {
        type: String,
        enum: ['Basic', 'Small-Cap', 'Mid-Cap', 'Large-Cap', 'Other'],
        required: true,
        default: 'Basic',
    },
    owner: {
        type: mongoose_1.Schema.ObjectId,
        required: true,
        ref: 'User',
    },
    admin: {
        type: mongoose_1.Schema.ObjectId,
        ref: 'User',
    },
    subscription: {
        type: String,
        enum: ['None', 'Basic', 'Pro'],
        required: true,
        default: 'None',
    },
    slug: String,
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// index to filter deleted organizations
organizationSchema.index({ owner: 1 }, { unique: true, partialFilterExpression: { deleted: { $ne: true } } });
// plugin for soft delete
organizationSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
organizationSchema.pre('save', function (next) {
    const slug = (0, slugify_1.default)(this.name, { lower: true });
    const uuid = (0, nanoid_1.nanoid)();
    this.slug = `${slug}-${uuid}`;
    next();
});
const organizationModel = (0, mongoose_1.model)('Organization', organizationSchema);
exports.default = organizationModel;
