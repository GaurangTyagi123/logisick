import { Router } from 'express';
import { forgotPassword, login, resetPassword, signup } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);
authRouter.post('/forgotPassword', forgotPassword);
authRouter.post('/resetPassword/:resetToken', resetPassword);

export default authRouter;
