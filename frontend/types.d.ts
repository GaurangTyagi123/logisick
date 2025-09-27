type User = {
	_id: string;
	name: string;
	email: string;
	isVerified: boolean;
	avatar: string;
	myOrg?: Org;
	createdAt:string;
	updatedAt:string
};

type Org = {
	_id: string;
	name: string;
	description: string;
	subscription: "None" | "Basic" | "Pro"
	members: number;
	active: boolean;
	admin: string;
	type: "Basic" | "Small-Cap" | "Mid-Cap" | "Large-Cap" | "Other";
};
