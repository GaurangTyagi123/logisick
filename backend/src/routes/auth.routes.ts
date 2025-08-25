import { Router } from 'express';
import {
    forgotPassword,
    isLoggedIn,
    login,
    protect,
    resetPassword,
    signup,
    verifyEmail,
} from '../controllers/auth.controller';

const authRouter = Router();

authRouter.get('/isLoggedIn', isLoggedIn);
authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/resetPassword/:resetToken', resetPassword);
authRouter.post('/verifyEmail', protect, verifyEmail);

export default authRouter;
