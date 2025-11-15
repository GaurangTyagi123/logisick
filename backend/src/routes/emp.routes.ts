import { Router } from "express";
import { protect, restrictTo } from "../controllers/auth.controller";
import {
	changeManager,
	changeRole,
	deleteEmp,
	getEmps,
	getMyOrgs,
	joinOrg,
	searchEmployee,
	sendInvite,
} from "../controllers/emp.controller";

const router = Router();

router.get("/myOrgs", protect, getMyOrgs); // done

// end-point to invite a user to organization
router.post("/sendInvite", protect, sendInvite); // ?
// router.post('/acceptInvite', protect, joinOrg); // ?

// end-point to accept invite to an organization
router.post("/acceptInvite", protect, joinOrg); // ?

// end-point to get all the employees belonging to a particular organization
router.get("/:orgid", protect, getEmps); // done

router.get("/:orgid/search", protect, searchEmployee); // done

// end-point to change the role of an employee
router.patch(
	"/:orgid/changeRole",
	protect,
	restrictTo("Admin", "Owner"),
	changeRole
); // ?

// end-point to change manager of an employee
router.patch(
	"/:orgid/changeManager",
	protect,
	restrictTo("Admin", "Owner"),
	changeManager
); // ?

// end-point to delete employee from an organization
router.delete(
	"/:orgid/delete",
	protect,
	restrictTo("Admin", "Owner"),
	deleteEmp
); // done

export default router;
