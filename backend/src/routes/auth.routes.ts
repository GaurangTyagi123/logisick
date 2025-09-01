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

// end-point to check whether the user is logged or not
authRouter.get('/isLoggedIn', isLoggedIn);

// end-point to sign up a new user
authRouter.post('/signup', signup);

// end-point to login
authRouter.post('/login', login);

// end-point to logout
authRouter.get('/logout', protect, logout);

// end-points for resetting password if the user has forgotten it
authRouter.post('/forgotPassword', forgotPassword);
authRouter.patch('/resetPassword/:resetToken', resetPassword);

//  end-point to verify user email
authRouter.post('/verifyEmail', protect, verifyEmail);

export default authRouter;
