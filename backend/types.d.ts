declare type ObjectId = import("mongoose").Schema.Types.ObjectId;

declare interface UserType {
	_id: ObjectId;
	name: string;
	email: string;
	password: string;
	confirmPassword: string | undefined;
	avatar: string;
	role: "admin" | "manager" | "staff";
	comparePasswords: (
		candidatePassword: string,
		actualPassword: string
	) => boolean;
	org: ObjectId;
}

declare interface OrgType {
	_id: ObjectId;
	name: string;
	description: string;
	type: string;
	admin: ObjectId;
}
