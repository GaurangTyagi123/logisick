import { Document, Schema, model } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

const userSchema = new Schema({
    googleId: String,
    name: {
        type: String,
        required: [true, 'User must have a name'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User must have an email'],
        validate: [validator.isEmail],
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    otp: String,
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
            validator: function (this: UserType, pass: string) {
                return pass === this.password;
            },
        },
    },
    passwordUpdatedAt: Date,
    resetPasswordToken: String,
    resetTokenExpireTime: Date,
    refreshToken: String,
    avatar: String,
    role: {
        type: String,
        enum: ['admin', 'manager', 'staff'],
        default: 'staff',
    },
    org: [
        {
            type: Schema.ObjectId,
            ref: 'Organization',
        },
    ],
});
userSchema.pre('save', async function (this: UserType, next) {
    if (!this.isModified('password')) return next();
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
    return next();
});
userSchema.pre('save', function (this: UserType, next) {
    if (!this.isModified('password') || this.isNew) return next();
    this.passwordUpdatedAt = new Date(Date.now() - 1000);
    next();
});

userSchema.methods.createPasswordResetToken = function (this: UserType) {
    const resetToken = crypto.randomBytes(32).toString('hex');
    console.log(resetToken);
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    this.resetTokenExpireTime = Date.now() + 10 * 60 * 1000;
    return resetToken;
};
userSchema.methods.comparePasswords = async function (
    candidatePassword: string,
    actualPassword: string
) {
    return await bcryptjs.compare(candidatePassword, actualPassword);
};
userSchema.methods.passwordUpdatedAfter = function (issuedTimeStamp: number) {
    if (this.passwordUpdatedAt) {
        const updateTimeStamp = this.passwordUpdatedAt.getTime() / 1000;
        return updateTimeStamp > issuedTimeStamp;
    }
};

const userModel = model<UserType>('User', userSchema);

export default userModel;
