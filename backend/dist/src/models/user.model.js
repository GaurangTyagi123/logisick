"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const validator_1 = __importDefault(require("validator"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const mongoose_delete_1 = __importDefault(require("mongoose-delete"));
/**
 * @brief User mongoose schema
 * @author `Gaurang Tyagi`
 */
const userSchema = new mongoose_1.Schema({
    googleId: String,
    name: {
        type: String,
        min: 5,
        validate: [validator_1.default.isAlpha],
        required: [true, 'User must have a name'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User must have an email'],
        validate: [validator_1.default.isEmail],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: String,
    otpExpireTime: Date,
    password: {
        type: String,
        min: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        min: 8,
        validate: {
            message: 'Passwords do not match',
            validator: function (pass) {
                return pass === this.password;
            },
        },
    },
    passwordUpdatedAt: {
        type: Date,
        select: false,
    },
    resetPasswordToken: String,
    resetTokenExpireTime: Date,
    refreshToken: String,
    avatar: {
        type: String,
        default: '',
        min: 1,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});
// mongoose delete plugin to implement soft delete 
userSchema.plugin(mongoose_delete_1.default, {
    deletedAt: true,
    deletedBy: false,
    overrideMethods: 'all',
});
userSchema.virtual('myOrg', {
    ref: 'Organization',
    localField: '_id',
    foreignField: 'owner',
    justOne: true,
});
// .User Model Middlewares
// This middleware runs before every user doc is created/saved and it hashes the user's password
userSchema.pre('save', async function (next) {
    // if the password field is not modified then call the next middleware
    if (!this.isModified('password'))
        return next();
    // hash the password
    this.password = await bcryptjs_1.default.hash(this.password, 12);
    // remove confirmPassword from the document
    this.confirmPassword = undefined;
    // call the next middleware
    return next();
});
// This middleware runs before every user doc is created/saved and stores the timestamp at which the password was updated
userSchema.pre('save', function (next) {
    // if the password was not modified and it is not a new document then call the next middleware
    if (!this.isModified('password') || this.isNew)
        return next();
    // update the passwordUpdatedAt field with the current timestamp - 1s to account for any server delays while generating the new json-webtoken
    this.passwordUpdatedAt = new Date(Date.now() - 1000);
    // call the next middleware
    next();
});
// This middleware runs before every find query and removes all user documents that are not active i.e., deleted
userSchema.pre(/find/, function (next) {
    this.find({ deleted: { $ne: true } }).populate({
        path: 'myOrg',
        select: '-__v',
    });
    next();
});
// . SCHEMA FUNCTIONS
// Creates and stores the password reset token
userSchema.methods.createPasswordResetToken = function () {
    const resetToken = crypto_1.default.randomBytes(32).toString('hex');
    this.resetPasswordToken = crypto_1.default
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetTokenExpireTime = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
// Compares the hashed password with the password given by the user trying to log in
userSchema.methods.comparePasswords = async function (actualPassword, hashPassword) {
    return await bcryptjs_1.default.compare(actualPassword, hashPassword);
};
// Checks whether the password was updated after the jwt was
userSchema.methods.passwordUpdatedAfter = function (issuedTimeStamp) {
    if (this.passwordUpdatedAt) {
        const updateTimeStamp = this.passwordUpdatedAt.getTime() / 1000;
        return updateTimeStamp > issuedTimeStamp;
    }
};
// Creates user model from the schema
const userModel = (0, mongoose_1.model)('User', userSchema);
exports.default = userModel;
