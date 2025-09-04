import axinstance from '@/utils/axios';
import { handleError } from '@/utils/handleError';

type UserUpdateForm = {
    name?: string;
    email?: string;
    avatar?: string;
    org?: string[];
};
type updateUser = (form: UserUpdateForm) => Promise<User | void>;

export const updateUser: updateUser = async (form) => {
    try {
        // set({ isUpdatingUser: true });
        if (Object.keys(form).length === 0) {
            throw new Error('There is nothing to update');
        }
        const res = await axinstance.post<{
            status: string;
            data: { updatedUser: User };
        }>('/v1/users/updateMe', form);
        // set({ user: res.data.data.updatedUser });
        // toast.success('User updated successfully', { className: 'toast' });
        return res.data.data.updatedUser;
    } catch (error) {
        handleError(error, 'Error updating user');
    }
};
