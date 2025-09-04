import axinstance from '@/utils/axios';
import { handleError } from '@/utils/handleError';
import { toast } from 'react-toastify';

// interface AuthProps {
//     user: User | null;
//     isCheckingAuth: boolean;
//     isLoggingIn: boolean;
//     checkAuth: () => Promise<void>;
// }

// type PasswordResetForm = {
//     prevPassword: string;
//     password: string;
//     confirmPassword: string;
// };
type checkAuth = () => Promise<{ user: User } | undefined>;
type signup = (form: {
    email: string;
    password: string;
    confirmPassword: string;
}) => Promise<User | undefined>;
type login = (form: {
    email: string;
    password: string;
}) => Promise<User | void>;
type sendForgotPassword = (form: {
    email: string;
}) => Promise<{ message: string } | undefined>;
type resetPassword = (
    resetToken: string,
    form: Record<string, string>
) => Promise<User | undefined>;

export const checkAuth: checkAuth = async () => {
    try {
        const res = await axinstance.get<{ data: { user: User } }>(
            'v1/auth/isLoggedIn'
        );
        const user = res.data.data.user;
        return { user };
    } catch (err) {
        console.log(err);
    }
};
export const signup: signup = async (form) => {
    try {
        // set({ isRegistering: true });
        const res = await axinstance.post<{
            status: string;
            data: { user: User };
        }>('/v1/auth/signup', form);

        // set({ user: res.data.data.user });
        return res.data.data.user;
    } catch (error) {
        handleError(error, 'Error registering new user');
    }
};
export const login: login = async (form: {
    email: string;
    password: string;
}) => {
    try {
        const res = await axinstance.post<{
            status: string;
            data: { user: User };
        }>('/v1/auth/login', form);
        return res.data.data.user;
    } catch (error) {
        handleError(error, 'error logging in user');
    }
};
export const logout = async () => {
    try {
        const res = await axinstance.get<{ status: string }>('/v1/auth/logout');
        const status = res.data.status;
        if (status === 'success') {
            return { status };
        } else {
            toast.error('Error Logging Out ', { className: 'toast' });
        }
    } catch (error) {
        handleError(error, 'Error logging out user');
    }
};
export const sendForgotToken: sendForgotPassword = async (form) => {
    try {
        // set({ isSendingForgotPassword: true });
        const res = await axinstance.post<{
            status: string;
            data: { message: string };
        }>('/v1/auth/forgotPassword', form);
        if (res.data.status === 'success') return res.data.data;
        else {
            toast.error('Error resetting password', { className: 'toast' });
        }
    } catch (error) {
        handleError(error, 'Error sending forgotpassword mail');
    }
};
export const resetPassword: resetPassword = async (resetToken, form) => {
    try {
        if (!resetToken.trim()) {
            toast.error('Invalid password reset url');
            return;
        }
        // set({ isResettingPassword: true });
        const res = await axinstance.patch<{
            status: string;
            data: { user: User };
        }>(`/v1/auth/resetPassword/${resetToken}`, form);
        if (res.data.status === 'success') {
            return res.data.data.user;
        } else {
            throw new Error('Error in resetting password');
        }
    } catch (error) {
        handleError(error, 'Error sending reset mail');
    }
};
