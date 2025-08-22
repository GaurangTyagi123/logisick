declare type ObjectId = import('mongoose').Types.ObjectId;


declare interface OrgType {
    _id: ObjectId;
    name: string;
    description: string;
    type: string;
    admin: ObjectId;
}
