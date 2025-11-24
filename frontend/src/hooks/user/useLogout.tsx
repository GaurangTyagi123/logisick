import { logout } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @brief hook to handle logout functionality of user
 * @param message optional parameter for logout message 
 * @returns logout state of app from react-query
 */
function useLogout(message: string = 'Logged-Out Successfully') {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: logoutFn, isPending:isLoggingOut } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success(message, {
                className: 'toast',
            });
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            navigate('/');
        },
    });
    return { logoutFn, isLoggingOut };
}

export default useLogout;
