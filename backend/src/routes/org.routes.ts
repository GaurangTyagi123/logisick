import { Router } from "express";
import { protect } from "../controllers/auth.controller";
import {
	createOrg,
	deleteOrg,
	transferOrg,
	updateOrg,
} from "../controllers/org.controller";

const router = Router();

// Endpoint to create new organization
router.post("/create", protect, createOrg);

// Endpoint to transfer the ownership of an organization
router.patch("/transfer", protect, transferOrg);
// Endpoint to update organization data
router.patch("/:orgid", protect, updateOrg);

// Endpoint to delete a organization (only by owner)
router.delete("/:orgid", protect, deleteOrg);

export default router;
