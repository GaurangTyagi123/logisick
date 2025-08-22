import { Document, Schema, model } from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

export interface UserType extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    confirmPassword: string | undefined;
    avatar?: string;
    role?: string;
    comparePasswords: (
        candidatePassword: string,
        actualPassword: string
    ) => boolean;
    org?: ObjectId;
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
    if (!this.isNew) return next();
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
    return next();
});
userSchema.methods.comparePasswords = async (
    candidatePassword: string,
    actualPassword: string
) => {
    return await bcryptjs.compare(candidatePassword, actualPassword);
};

const userModel = model<UserType>('User', userSchema);

export default userModel;
