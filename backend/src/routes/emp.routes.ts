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

router.get("/myOrgs", protect, getMyOrgs);

router.post("/sendInvite", protect, sendInvite);
router.post("/acceptInvite", protect, joinOrg);
router.get("/:orgid",protect, getEmps);

router.patch("/changeRole", protect, changeRole);
router.patch("/changeManager", protect, changeManager);

router.delete("/delete", protect, deleteEmp);

export default router;
