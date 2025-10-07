import { Router } from "express";
import { protect } from "../controllers/auth.controller";
import {
	changeManager,
	changeRole,
	deleteEmp,
	getEmps,
	getMyOrgs,
	joinOrg,
	sendInvite,
} from "../controllers/emp.controller";

const router = Router();

// TODO pagination
router.get("/myOrgs", protect, getMyOrgs);
// TODO employees under me

// end-point to invite a user to organization
router.post("/sendInvite", protect, sendInvite);
router.post("/acceptInvite", protect, joinOrg);
// TODO pagination
router.post("/getEmps", getEmps);

// end-point to accept invite to an organization
router.post("/acceptInvite", protect, joinOrg);

// end-point to get all the employees belonging to a particular organization
router.get("/:orgid",protect, getEmps);

// end-point to change the role of an employee
router.patch("/changeRole", protect, changeRole);

// end-point to change manager of an employee
router.patch("/changeManager", protect, changeManager);

// end-point to delete employee from an organization
router.delete("/delete", protect, deleteEmp);

export default router;
