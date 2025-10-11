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
	role: "Staff" | "Admin" | "Owner";
	deleted?: boolean;
	members?: number;
	type: "Basic" | "Small-Cap" | "Mid-Cap" | "Large-Cap" | "Other";
	slug: string;
	createdAt: string;
	updatedAt: string;
	deletedAt?: string;
};
type Emp = {
	_id: ObjectId;
	role: string;
	user: {
		name: string;
		email: string;
		avatar: string;
	}
}

type DummyOrg = {
	_id: string;
	name: string;
	subscription: "None" | "Basic" | "Pro";
	type: "Basic" | "Small-Cap" | "Mid-Cap" | "Large-Cap" | "Other";
	description: string;
};
