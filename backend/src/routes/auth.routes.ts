import { Router } from "express";
import {
	forgotPassword,
	isLoggedIn,
	login,
	logout,
	protect,
	resetPassword,
	signup,
	verifyEmail,
} from "../controllers/auth.controller";

const authRouter = Router();

// End-point to check whether the user is logged or not
authRouter.get("/isLoggedIn", isLoggedIn);

// End-point to sign up a new user
authRouter.post("/signup", signup);

// End-point to login
authRouter.post("/login", login);

// End-point to logout
authRouter.get("/logout", protect, logout);

// End-points for resetting password if the user has forgotten it
authRouter.post("/forgotPassword", forgotPassword);
authRouter.patch("/resetPassword/:resetToken", resetPassword);

// End-point to verify user email
authRouter.post("/verifyEmail", protect, verifyEmail);

export default authRouter;
