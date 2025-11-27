import { logout } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @brief hook to logout user
 * @returns {Function} `logoutFn` - function to logout user request
 * @returns {boolean} `isLoggingOut` - pending state of request
 * @author `Ravish Ranjan`
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
