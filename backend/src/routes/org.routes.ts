import { Router } from "express";
import { protect } from "../controllers/auth.controller";
import {
	createOrg,
	deleteOrg,
	getUserOrg,
	transferOrg,
} from "../controllers/org.controller";

const router = Router();

// Endpoint to get organization whereuser is owner
router.get("/myOrg", protect, getUserOrg);

// Endpoint to create new organization 
router.post("/create", protect, createOrg);

// Endpoint to transfer the ownership of an organization
router.patch("/transfer",protect,transferOrg)

// Endpoint to delete a organization (only by owner)
router.delete("/delete", protect, deleteOrg);

export default router;
