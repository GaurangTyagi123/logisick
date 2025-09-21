import { type Query, Schema, model } from "mongoose";

// TO BE IMPLEMENTED
const organizationSchema = new Schema(
	{
		name: {
			type: String,
			required: [true, "Organization must have a name"],
		},
		description: {
			type: String,
			default: "Your organization",
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

// middleware to filter the organizations which are not active during fetching
organizationSchema.pre(
	/find/,
	function (this: Query<UserType, MongooseDocument>, next) {
		this.find({ active: { $ne: false } });
		next();
	}
);

// soft deleting organization
organizationSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		await this.updateOne({ active: false });
		next();
	}
);

const organizationModel = model("Organization", organizationSchema);
export default organizationModel;
