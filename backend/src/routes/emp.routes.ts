import { Router } from "express";
import { protect } from "../controllers/auth.controller";
import { changeRole, getEmps, getMyOrgs } from "../controllers/emp.controller";

const router = Router();

router.get("/myOrgs", protect, getMyOrgs);
router.post("/getEmps", getEmps);
router.patch("/changeRole", protect, changeRole);

export default router;
