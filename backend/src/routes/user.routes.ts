import { Router } from 'express';
import {
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user.controller';
import { protect, restrictTo } from '../controllers/auth.controller';

const userRouter = Router();

userRouter
    .route('/')
    .get(protect, restrictTo('admin'), getUsers)
    .post(protect, updateUser)
    .delete(protect, deleteUser);
    
userRouter.route('/:id').get(protect, restrictTo('admin'), getUser);

export default userRouter;
