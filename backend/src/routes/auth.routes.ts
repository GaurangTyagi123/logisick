import { Router } from 'express';
import {
    forgotPassword,
    login,
    protect,
    resetPassword,
    signup,
    verifyEmail,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/resetPassword/:resetToken', resetPassword);
authRouter.post('/verifyEmail', protect, verifyEmail);

export default authRouter;
