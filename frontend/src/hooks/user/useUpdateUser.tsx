import { updateUser } from '@/services/apiUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * @brief hook to handle updating of user information 
 * @returns update user state of app from react-query
 */
function useUpdateUser() {
    const queryClient = useQueryClient();
    const { mutate: updateUserFn, isPending } = useMutation({
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
    return { updateUserFn, isPending };
}

export default useUpdateUser;
