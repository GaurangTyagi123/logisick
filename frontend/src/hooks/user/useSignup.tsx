import { signup } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @brief hook to sign up user
 * @returns {Function} `signupFn` - function to sign up user request
 * @returns {boolean} `isSigningUp` - pending state of request
 * @author `Ravish Ranjan`
 */
function useSignup() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: signupFn, isPending:isSigningUp } = useMutation({
        mutationFn: signup,
        onSuccess: () => {
            toast.success('Sign up successfull', { className: 'toast' });
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            navigate('/');
        },
        onError: (err) => {
            toast.error(err.message, { className: 'toast' });
        },
    });
    return { signupFn, isSigningUp };
}

export default useSignup;
