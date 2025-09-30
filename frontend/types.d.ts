type User = {
	_id: string;
	name: string;
	email: string;
	isVerified: boolean;
	avatar: string;
	myOrg?: Org;
	createdAt: string;
	updatedAt: string;
};

type Org = {
	_id: string;
	name: string;
	description: string;
	subscription: "None" | "Basic" | "Pro";
	admin: string;
	totalEmployees: number;
	deleted?: boolean;
	members?:number;
	type: "Basic" | "Small-Cap" | "Mid-Cap" | "Large-Cap" | "Other";
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
};
