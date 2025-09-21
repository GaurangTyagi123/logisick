import { type Query, Schema, model } from "mongoose";
import organizationModel from "./organization.model";

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
			enum: ["Owner", "Admin", "Manager", "Staff"],
			default: "staff",
			required: [true, "Employee must have a role in organization"],
		},
		manager: {
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

// middleware to filter the employees which are not active during fetching
employeeSchema.pre(
	/find/,
	function (this: Query<UserType, MongooseDocument>, next) {
		this.find({ active: { $ne: false } });
		next();
	}
);

// setting by default that manager od a manager should be the owner
employeeSchema.pre("save", async function (this: EmpType, next) {
	try {
		if (this.role === "Manager" && !this.manager) {
			const org = await organizationModel.findById(this.orgid);
			if (org && org.owner) {
				this.manager = org.owner;
			}
		}
		next();
	} catch (error) {
		next(error as Error);
	}
});

// soft delete for one employee
employeeSchema.pre(
	"deleteOne",
	{ document: true, query: false },
	async function (next) {
		await this.updateOne({ active: false });
		next();
	}
);

// soft delete for many employees
employeeSchema.pre(
	"deleteMany",
	{ document: false, query: true },
	async function (next) {
		await this.updateMany(this.getFilter(), { active: false });
		next();
	}
);

const employeeModel = model("Employee", employeeSchema);
export default employeeModel;
