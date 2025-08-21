import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'User must have a name'],
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'User must have an email'],
    },
    password: {
        type: String,
        required: [true, 'User must have a password'],
        min: 8,
        validate: [validator.isEmail],
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

const userModel = mongoose.model('User', userSchema);
export default userModel;
