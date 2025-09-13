import { updatePassword } from '@/services/apiUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useLogout from './useLogout';

/**
 * @objective hook to handle updating of password of user
 * @returns update password state of app from react-query
 */
function useUpdatePassword() {
    const queryClient = useQueryClient();
    const { logoutFn: logout } = useLogout('Please Login again');
    const { mutate: updatePasswordFn, isPending } = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success('Password changes successfully', {
                className: 'toast',
            });
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            logout();
        },
        onError: (err) => {
            toast.error(err.message,{className:"toast"});
        },
    });
    return { updatePasswordFn, isPending };
}

export default useUpdatePassword;
