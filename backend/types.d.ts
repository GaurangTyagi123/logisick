// IMP Express Types
namespace ExpressTypes {
    type Req = import('express').Request;
    type Response = import('express').Response;
    type NextFn = import('express').NextFn;

    interface Request extends Req {
        _parsedUrl?: { query?: string };
        parsedQuery?: import('qs').ParsedQs;
    }
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
    secure?: boolean;
    maxAge: date;
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
    slug: string;

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
    manager?: ObjectId;
    createdAt: Date;
    updatedAt: Date;

    deleted?: boolean;
    deletedAt?: Date | null;
}

declare interface ItemType extends Document {
    _id: ObjectId;
    name: string;
    barcode: string;
    organizationId: ObjectId;
    costPrice: number;
    sellingPrice: number;
    quantity: number;
    inventoryCategory: string;
    importedOn: Date;
    expiresOn: Date;
    colour?: string;
    weight?: number;
    reorderLevel?: number;
    batchNumber?: number;
    importance?: string;
    origin?: string;
    SKU?: string;
}

declare interface deliveryType {
    _id: string;
    fromOrgId: ObjectId;
    toOrgId: ObjectId;
    shipmentId: ObjectId;
    startDate: Date;
    status: 'shipped' | 'in-transit' | 'out-for-delivery' | 'Delivered';
    trackUrl?: string;
    ETA: Date;
}

declare interface shipmentType {
    _id: string;
    items: string;
    quantity: number;
    orderedOn: date;
    shipped: boolean;
}
