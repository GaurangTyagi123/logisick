import { Router } from 'express';
import {
    deleteUser,
    getUser,
    getUsers,
    updateUser,
} from '../controllers/user.controller';
import {
    protect,
    // restrictTo,
    updatePassword,
} from '../controllers/auth.controller';

const userRouter = Router();

// End point to get all the users belonging to a particular organization
userRouter.route('/').get(protect, /*restrictTo('admin'),*/ getUsers);

// End point to update user's profile data
userRouter
    .route('/updateMe')
    .post(protect, updateUser)
    .delete(protect, deleteUser);
userRouter.post('/updatePassword', protect, updatePassword);
userRouter.route('/:id').get(protect, /* restrictTo('admin'),*/ getUser);

export default userRouter;
