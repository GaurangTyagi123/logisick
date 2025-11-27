import { login } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @brief hook to login user from organization
 * @returns {Function} `loginFn` - function to login user request
 * @returns {boolean} `isLoggingIn` - pending state of request
 * @author `Ravish Ranjan`
 */
function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: loginFn, isPending:isLoggingIn } = useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success('LoggedIn Successfully', { className: 'toast' });
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            navigate('/');
        },
        onError: (err) => {
            toast.error(err.message, { className: 'toast' });
        },
    });
    return { loginFn, isLoggingIn };
}

export default useLogin;
