import { updateUser } from '@/services/apiuser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

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
            toast.error(err.message);
        },
    });
    return { updateUserFn, isPending };
}

export default useUpdateUser;
