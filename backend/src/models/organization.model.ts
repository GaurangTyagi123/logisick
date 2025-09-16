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
		type: String,
		admin: {
			type: Schema.ObjectId,
			ref: "User",
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

const organizationModel = model("Organization", organizationSchema);
export default organizationModel;
