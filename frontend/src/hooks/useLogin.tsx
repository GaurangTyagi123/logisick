import { login } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @objective hook to handle login function of user
 * @returns login state of app from react-query
 */
function useLogin() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: loginFn, isPending } = useMutation({
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
    return { loginFn, isPending };
}

export default useLogin;
