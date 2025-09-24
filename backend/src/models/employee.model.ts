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

// Middleware to filter the employees which are not active during fetching
employeeSchema.pre(
	/find/,
	function (this: Query<UserType, MongooseDocument>, next) {
		this.find({ active: { $ne: false } });
		next();
	}
);

// Setting by default that manager od a manager should be the owner
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

// Soft delete for one employee
employeeSchema.pre("deleteOne", async function () {
	if (this.getQuery) {
		await this.model.updateOne(this.getQuery(), { active: false });
	} else {
		await this.updateOne({ active: false });
	}
});

// For deleteMany (query context only)
employeeSchema.pre("deleteMany", async function () {
	await this.model.updateMany(this.getQuery(), { active: false });
});

// For findOneAndDelete (query context only)
employeeSchema.pre("findOneAndDelete", async function () {
	await this.model.updateOne(this.getQuery(), { active: false });
});

const employeeModel = model("Employee", employeeSchema);
export default employeeModel;
