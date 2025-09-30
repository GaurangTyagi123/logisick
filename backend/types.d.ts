// IMP Express Types
namespace ExpressTypes {
    type Request = import('express').Request;
    type Response = import('express').Response;
    type NextFn = import('express').NextFn;

    interface UserRequest extends Request {
        user?: UserType;
    }
    interface OAuthUser extends Express.User {
        user?: UserType;
    }
}

// type declaration for http-only cookie
declare type cookieOptionsType = {
    httpOnly: boolean;
    expires: Date;
    secure?: boolean;
};

// Types declaration for mongoose
type MongooseDocument = import('mongoose').Document;
declare type ObjectId = import('mongoose').Types.ObjectId;

// Type declaration for User Model
declare interface UserType extends MongooseDocument {
    _id: ObjectId;
    googleId?: string;
    name: string;
    email: string;
    isVerified: boolean;
    otp?: string | undefined;
    otpExpireTime?: string | undefined;

    password?: string;
    confirmPassword?: string | undefined;
    passwordUpdatedAt?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetTokenExpireTime?: number | undefined;
    refreshToken?: string | undefined;

    avatar?: string;
    myOrg?: OrgType;

    comparePasswords: (actualPassword: string, hashPassword: string) => Promise;
    createPasswordResetToken: () => string;
    passwordUpdatedAfter: (issuedTimeStamp: number) => boolean;
    deleted: boolean;

    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
}

// Type declaration for Organization Model
declare interface OrgType {
    _id: ObjectId;
    name: string;
    description: string;
    type: 'Basic' | 'Small-Cap' | 'Mid-Cap' | 'Large-Cap' | 'Other';
    totalEmployees: number;
    owner: ObjectId;
    admin?: ObjectId | null;
    subscription: 'None' | 'Basic' | 'Pro';
    members?: number;

    createdAt: Date;
    updatedAt: Date;

    deleted: boolean;
    deletedAt?: Date | null;
}

// type declareation for Employee Model
declare interface EmpType {
    _id: ObjectId;
    userid: ObjectId;
    orgid: ObjectId;
    role: 'Owner' | 'Admin' | 'Manager' | 'Staff';
    manager: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    deleted?: boolean;
    deletedAt?: Date | null;
}
