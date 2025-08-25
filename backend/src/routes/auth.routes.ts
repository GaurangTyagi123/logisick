import { Router } from 'express';
import {
    forgotPassword,
    isLoggedIn,
    login,
    logout,
    protect,
    resetPassword,
    signup,
    verifyEmail,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.get('/isLoggedIn', isLoggedIn);
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.get('/logout', protect, logout);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword/:resetToken', resetPassword);
authRouter.post('/verifyEmail', protect, verifyEmail);

export default authRouter;
