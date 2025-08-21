import mongoose from 'mongoose';
import validator from 'validator';
import bcryptjs from 'bcryptjs';

interface UserType {
    _id: mongoose.ObjectId;
    name: string;
    email: string;
    password: string;
    confirmPassword: string | undefined;
    avatar: string;
    role: 'admin' | 'manager' | 'staff';
    comparePasswords: (
        candidatePassword: string,
        actualPassword: string
    ) => boolean;
    org: mongoose.ObjectId;
}

const userSchema = new mongoose.Schema<UserType>({
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
        select : false
    },
    confirmPassword: {
        type: String,
        required: [true, 'User must have a confirmed Password'],
        min: 8,
        validate: {
            message: 'Passwords do not match',
            validator: function (pass) {
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
            type: mongoose.Schema.ObjectId,
            ref: 'Organization',
        },
    ],
});
userSchema.pre('save', async function (next) {
    if (!this.isNew) return next();
    this.password = await bcryptjs.hash(this.password, 12);
    this.confirmPassword = undefined;
    return next();
});
userSchema.methods.comparePasswords = async (
    candidatePassword: string,
    actualPassword: string
) => {
    const hashPassword = await bcryptjs.hash(candidatePassword, 12);
    return hashPassword === actualPassword;
};

const userModel = mongoose.model('User', userSchema);

export default userModel;
export { UserType };
