import { resetPassword } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

/**
 * @objective hook to handle resetting of password functionality
 * @returns reset password state of app from react-query
 */
function useResetPassword() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: resetPasswordFn, isPending } = useMutation({
        mutationFn: (variables: {
            resetToken: string;
            form: Record<string, string>;
        }) => resetPassword(variables.resetToken, variables.form),
        onSuccess: (data) => {
            toast.success('Password reset successfully', {
                className: 'toast',
            });
            queryClient.setQueryData(['user'], data);
            navigate("/");
        },
        onError: (err) => {
            toast.error(err.message, { className: 'toast' });
        },
    });
    return { resetPasswordFn, isPending };
}

export default useResetPassword;
