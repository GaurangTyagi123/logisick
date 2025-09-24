import { type Query, Schema, model } from "mongoose";

const organizationSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Organization must have a name"],
			minLength: 1,
			maxLength: 48,
		},
		description: {
			type: String,
			default: "Your organization",
			minLength: 8,
			maxLength: 300,
		},
		type: {
			type: String,
			enum: ["Basic", "Small-Cap", "Mid-Cap", "Large-Cap", "Other"],
			required: true,
			default: "Basic",
		},
		owner: {
			type: Schema.ObjectId,
			required: true,
			unique: true,
			ref: "User",
		},
		admin: {
			type: Schema.ObjectId,
			ref: "User",
		},
		subscription: {
			type: String,
			enum: ["None", "Basic", "Pro"],
			required: true,
			default: "None",
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// Middleware to filter the organizations which are not active during fetching
organizationSchema.pre(
	/find/,
	function (this: Query<UserType, MongooseDocument>, next) {
		this.find({ active: { $ne: false } });
		next();
	}
);

// Soft deleting organization
organizationSchema.pre("deleteOne", async function () {
	if (this.getQuery) {
		await this.model.updateOne(this.getQuery(), { active: false });
	} else {
		await this.updateOne({ active: false });
	}
});

// For deleteMany (query context only)
organizationSchema.pre("deleteMany", async function () {
	await this.model.updateMany(this.getQuery(), { active: false });
});

// For findOneAndDelete (query context only)
organizationSchema.pre("findOneAndDelete", async function () {
	await this.model.updateOne(this.getQuery(), { active: false });
});

const organizationModel = model("Organization", organizationSchema);
export default organizationModel;
