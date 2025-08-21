import { Router } from 'express';
import { login, signup } from '../controllers/auth.controller';

const authRouter = Router();

authRouter.post('/signup', signup);
authRouter.post('/login', login);

export default authRouter;
