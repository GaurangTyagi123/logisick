import { signup } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function useSignup() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: signupFn, isPending } = useMutation({
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
    return { signupFn, isPending };
}

export default useSignup;
