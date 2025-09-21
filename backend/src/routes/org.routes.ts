import { Router } from "express";
import { protect } from "../controllers/auth.controller";
import {
	createOrg,
	deleteOrg,
	getUserOrg,
} from "../controllers/org.controller";

const router = Router();

router.get("/myOrg", protect, getUserOrg);
router.post("/create", protect, createOrg);
router.delete("/delete", protect, deleteOrg);

export default router;
