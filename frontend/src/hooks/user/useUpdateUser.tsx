import { updateUser } from '@/services/apiUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * @brief hook to update user
 * @returns {Function} `updateUserFn` - function to update user request
 * @returns {boolean} `isUpdatingUser` - pending state of request
 * @author `Ravish Ranjan`
 */
function useUpdateUser() {
    const queryClient = useQueryClient();
    const { mutate: updateUserFn, isPending:isUpdatingUser } = useMutation({
        mutationFn: updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            toast.success('User updated successfully', { className: 'toast' });
        },
        onError: (err) => {
            toast.error(err.message,{className:"toast"});
        },
    });
    return { updateUserFn, isUpdatingUser };
}

export default useUpdateUser;
