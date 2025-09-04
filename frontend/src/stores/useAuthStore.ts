import axinstance from '@/utils/axios';
import { isAxiosError } from 'axios';
import { toast } from 'react-toastify';
// import { userDb } from "@/utils/db";
import { create } from 'zustand';

// TODO: clean this file
type RegisterForm = {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
};

type PasswordResetForm = {
    prevPassword: string;
    password: string;
    confirmPassword: string;
};

type UserUpdateForm = {
    name?: string;
    email?: string;
    avatar?: string;
    org?: string[];
};

interface AuthProps {
    user: User | null;
    isCheckingAuth: boolean;
    isLoggingIn: boolean;
    isRegistering: boolean;
    isVerifingEmail: boolean;
    isUpdatingUser: boolean;
    isSendingForgotPassword: boolean;
    isResettingPassword: boolean;
    isChangingPassword: boolean;
    checkAuth: () => Promise<void>;
    login: (form: { email: string; password: string }) => Promise<void>;
    register: (form: RegisterForm) => Promise<void>;
    logout: () => Promise<void>;
    verifyEmail: (form: {
        otp?: string;
    }) => Promise<'already' | 'sent' | 'verified' | undefined>;
    updateUser: (form: UserUpdateForm) => Promise<void>;
    sendForgotPassword: (form: { email: string }) => Promise<void>;
    resetPassword: (
        resetToken: string,
        form: PasswordResetForm
    ) => Promise<void>;
    changePassword: (form: {
        password: string;
        confirmPassword: string;
    }) => Promise<void>;
}

function handleError(error: unknown, message: string) {
    if (isAxiosError(error)) {
        const msg = error.response?.data?.message || message;
        console.log(msg);
        toast.error(msg, { className: 'toast' });
    } else {
        console.log(error);
    }
}

const useAuthStore = create<AuthProps>((set) => ({
    user: null,
    isCheckingAuth: true,
    isLoggingIn: false,
    isRegistering: false,
    isVerifingEmail: false,
    isUpdatingUser: false,
    isSendingForgotPassword: false,
    isResettingPassword: false,
    isChangingPassword: false,
    checkAuth: async () => {
        try {
            set({ isCheckingAuth: true });
            const res = await axinstance.get<{
                status: string;
                isLoggedIn: boolean;
                data: { user: User };
            }>('/v1/auth/isLoggedIn');
            const user = res.data.data.user;
            set({ user: user });
        } catch (error) {
            console.log(error);
            set({ user: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    login: async (form) => {
        try {
            set({ isLoggingIn: true });
            const res = await axinstance.post<{
                status: string;
                data: { user: User };
            }>('/v1/auth/login', form);

            set({ user: res.data.data.user });
            toast.success('LoggedIn Successfully', { className: 'toast' });
        } catch (error) {
            handleError(error, 'Error logging in');
        } finally {
            set({ isLoggingIn: false });
        }
    },
    register: async (form) => {
        try {
            set({ isRegistering: true });
            const res = await axinstance.post<{
                status: string;
                data: { user: User };
            }>('/v1/auth/signup', form);

            set({ user: res.data.data.user });
            toast.success('Registered successfully', { className: 'toast' });
        } catch (error) {
            handleError(error, 'Error registering new user');
        } finally {
            set({ isRegistering: false });
        }
    },
    logout: async () => {
        try {
            const res = await axinstance.get<{ status: string }>(
                '/v1/auth/logout'
            );
            console.log('Logout', res);
            const status = res.data.status;
            if (status === 'success') {
                set({ user: null });
                toast.success('Logged-Out Successfully', {
                    className: 'toast',
                });
                localStorage.removeItem('AuthToken');
            } else {
                toast.error('Error Logging Out ', { className: 'toast' });
            }
        } catch (error) {
            handleError(error, 'Error logging out user');
        }
    },
    verifyEmail: async (form) => {
        try {
            set({ isVerifingEmail: true });
            const res = await axinstance.post<{
                status: string;
                data: { message: string };
            }>('/v1/auth/verifyEmail', form);
            if (res.data.data.message.toLowerCase().includes('already')) {
                set({ isVerifingEmail: false });
                toast.success(res.data.data.message, { className: 'toast' });
                return 'already';
            } else if (res.data.data.message.toLowerCase().includes('sent')) {
                set({ isVerifingEmail: false });
                toast.success(res.data.data.message, { className: 'toast' });
                return 'sent';
            } else if (
                res.data.data.message.toLowerCase().includes('successfully')
            ) {
                set({
                    isVerifingEmail: false,
                });
                toast.success(res.data.data.message, { className: 'toast' });
                return 'verified';
            }
        } catch (error) {
            handleError(error, 'Error verifing email');
        } finally {
            set({ isVerifingEmail: false });
        }
    },
    updateUser: async (form) => {
        try {
            set({ isUpdatingUser: true });
            if (Object.keys(form).length === 0) {
                toast.error('Nothing to update', { className: 'toast' });
                return;
            }
            const res = await axinstance.post<{
                status: string;
                data: { updatedUser: User };
            }>('/v1/users/updateMe', form);
            set({ user: res.data.data.updatedUser });
            toast.success('User updated successfully', { className: 'toast' });
        } catch (error) {
            handleError(error, 'Error updating user');
        } finally {
            set({ isUpdatingUser: false });
        }
    },
    sendForgotPassword: async (form) => {
        try {
            set({ isSendingForgotPassword: true });
            const res = await axinstance.post<{
                status: string;
                data: { message: string };
            }>('/v1/auth/forgotPassword', form);
            toast.success(res.data.data.message, { className: 'toast' });
        } catch (error) {
            handleError(error, 'Error sending forgotpassword mail');
        } finally {
            set({ isSendingForgotPassword: false });
        }
    },
    resetPassword: async (resetToken, form) => {
        try {
            if (!resetToken.trim()) {
                toast.error('Invalid password reset url');
                return;
            }
            set({ isResettingPassword: true });
            const res = await axinstance.patch<{
                status: string;
                data: { user: User };
            }>(`/v1/auth/resetPassword/${resetToken}`, form);
            set({ user: res.data.data.user });
            toast.success('Password got reset successfully', {
                className: 'toast',
            });
        } catch (error) {
            handleError(error, 'Error sending reset mail');
        } finally {
            set({ isResettingPassword: true });
        }
    },
    changePassword: async (form) => {
        try {
            set({ isChangingPassword: true });
            const res = await axinstance.post<{
                status: string;
                data: { user: User };
            }>('/v1/users/updatePassword', form);

            set({ user: res.data.data.user });
            toast.success('Password changes successfully', {
                className: 'toast',
            });
        } catch (error) {
            handleError(error, 'Error changing password');
        } finally {
            set({ isChangingPassword: false });
        }
    },
}));

export default useAuthStore;
