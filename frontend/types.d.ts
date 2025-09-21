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
	description: string;
	active: boolean;
	admin: string;
	type: "Basic" | "Small-Cap" | "Mid-Cap" | "Large-Cap" | "Other";
};
