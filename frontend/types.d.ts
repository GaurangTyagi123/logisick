type User = {
	_id: string;
	name: string;
	email: string;
	isVerified: boolean;
	password: string;
	avatar: string;
	role: "admin" | "manager" | "staff";
	updatedAt: string;
	org: string[];
	passwordUpdatedAt: Date;
};

type Org = {
	_id: string;
	name: string;
	isActive: boolean;
	description: string;
	admin_id: string;
	type: "individual" | "small-cap" | "mid-cap" | "large-cap" | "other";
};
