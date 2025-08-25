type User = {
	name: string;
	email: string;
	isVerified: boolean;
	avatar: string;
	role: "admin" | "manager" | "staff";
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
