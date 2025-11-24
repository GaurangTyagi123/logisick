import { resetPassword } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// form type fof reset password
type PasswordResetForm = {
    password: string;
    confirmPassword: string;
};

/**
 * @brief hook to handle resetting of password functionality
 * @returns reset password state of app from react-query
 */
function useResetPassword() {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: resetPasswordFn, isPending:isResettingPassword } = useMutation({
        mutationFn: (variables: {
            resetToken: string;
            form: PasswordResetForm;
        }) => resetPassword(variables.resetToken, variables.form),
        onSuccess: (data) => {
            if (data) {
                toast.success('Password reset successfully', {
                    className: 'toast',
                });
                queryClient.setQueryData(['user'], data);
                navigate("/");
            }
            else {
                toast.error('Error updating the password')
                navigate('/authenticate')
            }
        },
        onError: (err) => {
            toast.error(err.message, { className: 'toast' });
        },
    });
    return { resetPasswordFn, isResettingPassword };
}

export default useResetPassword;
