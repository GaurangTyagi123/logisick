import { sendForgotToken } from '@/services/apiAuth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * @brief hook to handle forgot password functionality of user
 * @returns forgot password state of app from react-query
 */
function useSendForgotPassword() {
    const { mutate: sendForgotPassword, isPending:isSendingForgotPassword } = useMutation({
        mutationFn: sendForgotToken,
        onSuccess: (data) => {
            toast.success(data?.message, { className: 'toast' });
        },
        onError: (err) => {
            toast.error(err.message, { className: 'toast' });
        },
    });
    return { sendForgotPassword, isSendingForgotPassword };
}

export default useSendForgotPassword;
