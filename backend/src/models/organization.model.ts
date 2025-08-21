import { Schema, model } from "mongoose";

const organizationSchema = new Schema({
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
});

const organizationModel = model("Organization", organizationSchema);
export default organizationModel;
