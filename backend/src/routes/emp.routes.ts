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

router.post("/sendInvite", protect, sendInvite);
router.post("/acceptInvite", protect, joinOrg);
// TODO pagination
router.post("/getEmps", getEmps);

router.patch("/changeRole", protect, changeRole);
router.patch("/changeManager", protect, changeManager);

router.delete("/delete", protect, deleteEmp);

export default router;
