type User = {
	_id: string;
	name: string;
	email: string;
	isVerified: boolean;
	avatar: string;
	createdAt:string;
	updatedAt:string
};

type Org = {
	_id: string;
	name: string;
	isActive: boolean;
	description: string;
	admin_id: string;
	type: "individual" | "small-cap" | "mid-cap" | "large-cap" | "other";
};
