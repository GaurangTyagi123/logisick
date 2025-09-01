import catchAsync from '../utils/catchAsync';
import User from '../models/user.model';
import AppError from '../utils/appError';
import checkRequestBody from '../utils/checkRequestBody';

/**
 * @params req(Request) res(Express Response) next(Express Next Function)
 * @preCondition user is logged in && user is an admin
 * @return (TO BE IMPLEMENTED) all the users working for the organization of admin
 */
export const getUsers = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const users = await User.find({ role: { $ne: 'admin' } });
        const results = users.length;
        return res.status(200).json({
            status: 'success',
            results,
            data: {
                users,
            },
        });
    }
);
// TODO : Add a route to the request handler below
/**
 * @params req(Request) res(Express Response) next(Express Next Function)
 * @preCondition user is logged in & user is an admin
 * @requestParams user id
 * @return IF (id is correct) then return the user data with that id
 *         ELSE return status:400 message:incorrect id
 */
export const getUser = catchAsync(
    async (
        req: ExpressTypes.Request,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        const id = req.params.id;
        if (!id)
            return next(new AppError('Please provide a valid user id', 400));

        const user = await User.findById(id);
        if (!user) return next(new AppError('No such user exists', 400));

        return res.status(200).json({
            status: 'success',
            data: {
                user,
            },
        });
    }
);

/**
 * @params req(User Request) res(Express Response) next(Express Next Function)
 * @preCondition user is logged in
 * @body new data
 * @approach If the body contains any sensitive field like isVerified | role | passwordUpdatedAt then checkRequestBody removes them from the body. If the body contains email as one of the field then we update the isVerified field and set it to false and then we update the user details
 * @return IF (details were updated successfully) send the new user-data as JSON response
 *         ELSE return status:500 message:internal error
 */
export const updateUser = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        if (req.body.password || req.body.confirmPassword)
            return next(new AppError('Password cannot be updated here', 400));
        let newData = req.body;
        newData = checkRequestBody(newData, [
            'isVerified',
            'role',
            'passwordUpdatedAt',
        ]);

        let updatedUser;
        if (newData.email) {
            newData.isVerified = false;
            updatedUser = await User.findByIdAndUpdate(req.user?._id, newData, {
                new: true,
                runValidators: true,
            });
        } else
            updatedUser = updatedUser = await User.findByIdAndUpdate(
                req.user?._id,
                newData,
                { new: true, runValidators: true }
            );
        if (!updateUser) return next(new AppError('There was an error', 500));
        return res.status(200).json({
            status: 'success',
            data: {
                updatedUser,
            },
        });
    }
);

/**
 * @params req(User Request) res(Express Response) next(Express Next Function)
 * @preCondition user is logged in
 * @body new data
 * @return update the user's active field to false
 */
export const deleteUser = catchAsync(
    async (
        req: ExpressTypes.UserRequest,
        res: ExpressTypes.Response,
        next: ExpressTypes.NextFn
    ) => {
        await User.findByIdAndUpdate(req.user?._id, {
            active: false,
        });
        return res.status(204);
    }
);
