import { Document, Schema, model } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';
import crypto from 'crypto';

export interface UserType extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    confirmPassword?: string | undefined;
    passwordUpdatedAt?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetTokenExpireTime?: number | undefined;
    avatar?: string;
    role?: string;
    org?: ObjectId;

    comparePasswords: (
        candidatePassword: string,
        actualPassword: string
    ) => boolean;
    createPasswordResetToken: () => string;
}

const userSchema = new Schema({
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
    password: {
        type: String,
        required: [true, 'User must have a password'],
        min: 8,
        select: false,
    },
    confirmPassword: {
        type: String,
        required: [true, 'User must have a confirmed Password'],
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
    if (!this.isModified("password")) return next();
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

const userModel = model<UserType>('User', userSchema);

export default userModel;
