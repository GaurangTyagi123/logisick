import { Router } from "express";
import {
	forgotPassword,
	login,
	protect,
	resetPassword,
	signup,
	verifyEmail,
	passOn,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/checkAuth", protect, passOn);
authRouter.post("/signup", signup);
authRouter.post("/login", login);
authRouter.post("/forgotPassword", forgotPassword);
authRouter.post("/resetPassword/:resetToken", resetPassword);
authRouter.post("/verifyEmail", protect, verifyEmail);

export default authRouter;
