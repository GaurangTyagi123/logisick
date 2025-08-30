import axinstance from "@/utils/axios";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
// import { userDb } from "@/utils/db";
import { create } from "zustand";

type LoginForm = {
	email: string;
	password: string;
};

type RegisterForm = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

type EmailForm = {
	otp?: string;
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

type ForgotPasswordForm = {
	email: string;
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
	checkAuth: () => Promise<void>;
	login: (form: LoginForm) => Promise<void>;
	register: (form: RegisterForm) => Promise<void>;
	logout: () => Promise<void>;
	verifyEmail: (
		form: EmailForm
	) => Promise<"already" | "sent" | "verified" | undefined>;
	updateUser: (form: UserUpdateForm) => Promise<void>;
	sendForgotPassword: (form: ForgotPasswordForm) => Promise<void>;
	resetPassword: (
		resetToken: string,
		form: PasswordResetForm
	) => Promise<void>;
}

const useAuthStore = create<AuthProps>((set, get) => ({
	user: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isRegistering: false,
	isVerifingEmail: false,
	isUpdatingUser: false,
	isSendingForgotPassword: false,
	isResettingPassword: false,
	checkAuth: async () => {
		try {
			set({ isCheckingAuth: true });
			const res = await axinstance.get<{
				status: string;
				isLoggedIn: boolean;
				data: { user: User };
			}>("/v1/auth/isLoggedIn");
			const user = res.data.data.user;
			console.log("User", user);
			set({ user: user });
		} catch (error) {
			console.log(error);
			// const old = await userDb.getUserMeta();
			// if (old) {
			// 	await userDb.setUserMeta(old.user, false);
			// }
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
			}>("/v1/auth/login", form);

			set({ user: res.data.data.user });
			toast.success("LoggedIn Successfully", { className: "toast" });
		} catch (error) {
			if (isAxiosError(error)) {
				const msg = error.response?.data?.message || "Error logging in";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
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
			}>("/v1/auth/signup", form);

			set({ user: res.data.data.user });
			toast.success("Registered successfully", { className: "toast" });
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.message || "Error registering user";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
		} finally {
			set({ isRegistering: false });
		}
	},
	logout: async () => {
		try {
			const res = await axinstance.get<{ status: string }>(
				"/v1/auth/logout"
			);
			console.log("Logout", res);
			const status = res.data.status;
			if (status === "success") {
				set({ user: null });
				toast.success("Logged-Out Successfully", {
					className: "toast",
				});
				localStorage.removeItem("AuthToken");
			} else {
				toast.error("Error Logging Out ", { className: "toast" });
			}
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.message || "Error logging out user";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
		}
	},
	verifyEmail: async (form) => {
		try {
			set({ isVerifingEmail: true });
			const res = await axinstance.post<{
				status: string;
				data: { message: string };
			}>("/v1/auth/verifyEmail", form);
			if (res.data.data.message.toLowerCase().includes("already")) {
				set({ isVerifingEmail: false });
				toast.success(res.data.data.message, { className: "toast" });
				return "already";
			} else if (res.data.data.message.toLowerCase().includes("sent")) {
				set({ isVerifingEmail: false });
				toast.success(res.data.data.message, { className: "toast" });
				return "sent";
			} else if (
				res.data.data.message.toLowerCase().includes("successfully")
			) {
				set({
					isVerifingEmail: false,
					user: { ...(get().user as User), isVerified: true },
				});
				toast.success(res.data.data.message, { className: "toast" });
				return "verified";
			}
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.message || "Error verifing email";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
		} finally {
			set({ isVerifingEmail: false });
		}
	},
	updateUser: async (form) => {
		try {
			set({ isUpdatingUser: true });
			if (Object.keys(form).length === 0) {
				toast.error("Nothing to update", { className: "toast" });
				return;
			}
			const res = await axinstance.post<{
				status: string;
				data: { updatedUser: User };
			}>("/v1/users/updateMe", form);
			set({ user: res.data.data.updatedUser });
			toast.success("User updated successfully", { className: "toast" });
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.message || "Error updating user";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
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
			}>("/v1/auth/forgotPassword", form);
			toast.success(res.data.data.message, { className: "toast" });
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.message ||
					"Error sending forgotpassword mail";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
		} finally {
			set({ isSendingForgotPassword: false });
		}
	},
	resetPassword: async (resetToken, form) => {
		try {
			if (!resetToken.trim()) {
				toast.error("Invalid password reset url");
				return;
			}
			set({ isResettingPassword: true });
			const res = await axinstance.patch<{
				status: string;
				data: { user: User };
			}>(`/v1/auth/resetPassword/${resetToken}`, form);
			set({ user: res.data.data.user });
			toast.success("Password got reset successfully", {
				className: "toast",
			});
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.message || "Error sending reset mail";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
		} finally {
			set({ isResettingPassword: true });
		}
	},
}));

export default useAuthStore;
