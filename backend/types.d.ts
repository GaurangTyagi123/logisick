type MongooseDocument = import('mongoose').Document;
type ExpressRequest = import('express').Request;

declare type ObjectId = import('mongoose').Types.ObjectId;
declare type cookieOptionsType = {
    httpOnly: boolean;
    expires: Date;
    secure?: boolean;
};
declare interface UserType extends MongooseDocument {
    _id: ObjectId;
    googleId?: string;
    name: string;
    email: string;
    isVerified: boolean;
    otp?: string | undefined;

    password: string;
    confirmPassword?: string | undefined;
    passwordUpdatedAt?: Date | undefined;
    resetPasswordToken?: string | undefined;
    resetTokenExpireTime?: number | undefined;
    refreshToken?: string | undefined;

    avatar?: string;
    role?: string;
    org?: ObjectId;

    comparePasswords: (
        candidatePassword: string,
        actualPassword: string
    ) => Promise;
    createPasswordResetToken: () => string;
    passwordUpdatedAfter: (issuedTimeStamp: number) => boolean;
}
declare interface UserRequest extends ExpressRequest {
    user?: UserType;
}
declare interface OAuthUser extends Express.User {
    user?: UserType;
}
declare interface OrgType {
    _id: ObjectId;
    name: string;
    description: string;
    type: string;
    admin: ObjectId;
}
