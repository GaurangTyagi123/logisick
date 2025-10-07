import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/user.model';
dotenv.config({ path: '../../config.env' });


const user_data = [
    {
        _id: '671c1f01a1b2c10000000101',
        googleId: 'g-101',
        name: 'Alice Johnson',
        email: 'alice@example.com',
        isVerified: true,
        password: 'password123',
        avatar: 'https://example.com/avatar1.png',
    },
    {
        _id: '671c1f01a1b2c10000000102',
        googleId: 'g-102',
        name: 'Bob Smith',
        email: 'bob@example.com',
        isVerified: false,
        password: 'password123',
        avatar: 'https://example.com/avatar2.png',
    },
    {
        _id: '671c1f01a1b2c10000000103',
        googleId: 'g-103',
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        isVerified: true,
        password: 'password123',
        avatar: 'https://example.com/avatar3.png',
    },
    {
        _id: '671c1f01a1b2c10000000104',
        googleId: 'g-104',
        name: 'Diana Adams',
        email: 'diana@example.com',
        isVerified: false,
        password: 'password123',
        avatar: 'https://example.com/avatar4.png',
    },
    {
        _id: '671c1f01a1b2c10000000105',
        googleId: 'g-105',
        name: 'Ethan Clark',
        email: 'ethan@example.com',
        isVerified: true,
        password: 'password123',
        avatar: 'https://example.com/avatar5.png',
    },
    {
        _id: '671c1f01a1b2c10000000106',
        googleId: 'g-106',
        name: 'Fiona Miller',
        email: 'fiona@example.com',
        isVerified: false,
        password: 'password123',
        avatar: 'https://example.com/avatar6.png',
    },
    {
        _id: '671c1f01a1b2c10000000107',
        googleId: 'g-107',
        name: 'George Wilson',
        email: 'george@example.com',
        isVerified: true,
        password: 'password123',
        avatar: 'https://example.com/avatar7.png',
    },
    {
        _id: '671c1f01a1b2c10000000108',
        googleId: 'g-108',
        name: 'Hannah Lee',
        email: 'hannah@example.com',
        isVerified: true,
        password: 'password123',
        avatar: 'https://example.com/avatar8.png',
    },
    {
        _id: '671c1f01a1b2c10000000109',
        googleId: 'g-109',
        name: 'Ian Davis',
        email: 'ian@example.com',
        isVerified: false,
        password: 'password123',
        avatar: 'https://example.com/avatar9.png',
    },
    {
        _id: '671c1f01a1b2c10000000110',
        googleId: 'g-110',
        name: 'Jenna White',
        email: 'jenna@example.com',
        isVerified: true,
        password: 'password123',
        avatar: 'https://example.com/avatar10.png',
    },
];

mongoose.connect('mongodb://0.0.0.0:27017/LogiSick');
export const import_user = async () => {
    console.log('IMPORTING USERS...');
    await User.create(user_data);
    process.exit();
};
export const delete_user = async () => {
    console.log('DELETING USERS...');
    await User.deleteMany({});
    process.exit();
};
const flag = process.argv[2];

if (flag == '--import') {
    import_user();
}
if (flag == '--delete') {
    delete_user();
}
