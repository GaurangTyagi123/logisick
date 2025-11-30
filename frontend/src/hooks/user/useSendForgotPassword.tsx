import { sendForgotToken } from '@/services/apiAuth';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';

/**
 * @brief hook to send forgot password request
 * @returns {Function} `sendFrgotPassword` - function to send forgot password request
 * @returns {boolean} `isSendingForgotPassword` - pending state of request
 * @author `Ravish Ranjan`
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
