import { type Query, Schema, model } from "mongoose";

const employeeSchema = new Schema(
	{
		userid: {
			type: Schema.ObjectId,
			required: [true, "Employee have to be user first"],
			ref: "User",
		},
		orgid: {
			type: Schema.ObjectId,
			required: [true, "Organization is required for employee"],
			ref: "Organization",
		},
		role: {
			type: String,
			enum: Object.keys(EmployeeRole),
			default: EmployeeRole.STAFF,
			required: [true, "Employee must have a role in organization"],
		},
		active: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

// middleware to filter the employees which are not active during fetching
employeeSchema.pre(
	/find/,
	function (this: Query<UserType, MongooseDocument>, next) {
		this.find({ active: { $ne: false } });
		next();
	}
);

const employeeModel = model("Employee", employeeSchema);
export default employeeModel;
