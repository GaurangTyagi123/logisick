import { Router } from "express";
import {
	deleteUser,
	getUser,
	getUsers,
	updateUser,
} from "../controllers/user.controller";
import {
	// restrictTo,
	updatePassword,
} from "../controllers/auth.controller";
import { csrfProtection, protect } from "../middlewares/auth.middleware";

const userRouter = Router();

// End point to get all the users belonging to a particular organization
userRouter.route("/").get(protect, /*restrictTo('admin'),*/ getUsers);

// End point to update user's profile data
userRouter
	.route("/updateMe")
	.post(csrfProtection,protect, updateUser)
	.delete(csrfProtection,protect, deleteUser);
userRouter.post("/updatePassword",csrfProtection, protect, updatePassword);
userRouter.route("/:id").get(protect, getUser);

export default userRouter;
