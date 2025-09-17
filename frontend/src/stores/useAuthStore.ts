import axinstance from "@/utils/axios";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
// import { userDb } from "@/utils/db";
import { create } from "zustand";

// TODO: clean this file
type RegisterForm = {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
};

type PasswordResetForm = {
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
	isDeleteingUser: boolean;
	checkAuth: () => Promise<void>;
	login: (form: { email: string; password: string }) => Promise<void>;
	register: (form: RegisterForm) => Promise<void>;
	logout: () => Promise<void>;
	verifyEmail: (form: {
		otp?: string;
	}) => Promise<"already" | "sent" | "verified" | undefined>;
	updateUser: (form: UserUpdateForm) => Promise<void>;
	sendForgotPassword: (form: { email: string }) => Promise<void>;
	resetPassword: (
		resetToken: string,
		form: PasswordResetForm
	) => Promise<void>;
	changePassword: (form: {
		prevPassword:string;
		password: string;
		confirmPassword: string;
	}) => Promise<void>;
	deleteUser: () => Promise<void>;
}

/**
 * @objective function to handle error for async API class to server or system error
 * @param error instance of error
 * @param message custom message for toast to user
 */
function handleError(error: unknown, message: string) {
	if (isAxiosError(error)) {
		const msg = error.response?.data?.message || message;
		console.log(error);
		toast.error(msg, { className: "toast" });
	} else {
		console.log(error);
	}
}

/**
 * @objective hook to handle user authentication functions 
 */
const useAuthStore = create<AuthProps>((set) => ({
	user: null, // user state
	isCheckingAuth: true, // boolean value to tell if check auth request is processing
	isLoggingIn: false, // boolean value to tell if logging in request is processing
	isRegistering: false, // boolean value to tell if registering request is processing
	isVerifingEmail: false, // boolean value to tell if verifying email request is processing
	isUpdatingUser: false, // boolean value to tell if updating user request is processing
	isSendingForgotPassword: false, // boolean value to tell if seding forgot password mail request is processing
	isResettingPassword: false, // boolean value to tell if resetting password request is processing
	isChangingPassword: false, // boolean value to tell if changing password request is processing
	isDeleteingUser: false, // boolean value to tell if deleting userrequest is processing
	/**
	 * @objective async function to request api to check user authentication
	 * @effect updates user state
	 */
	checkAuth: async () => {
		try {
			set({ isCheckingAuth: true });
			const res = await axinstance.get<{
				status: string;
				isLoggedIn: boolean;
				data: { user: User };
			}>("/v1/auth/isLoggedIn");
			const user = res.data.data.user;
			set({ user: user });
		} catch (error) {
			console.log(error);
			set({ user: null });
		} finally {
			set({ isCheckingAuth: false });
		}
	},
	/**
	 * @objective async function to request api to login user
	 * @param form data for login containing (email,password)
	 * @effect updated user state if logged in successfully
	 */
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
			handleError(error, "Error logging in");
		} finally {
			set({ isLoggingIn: false });
		}
	},
	/**
	 * @objective async function to request api to register new user
	 * @param form data for registering (name,email,password,confirm password)
	 * @effect updates user state if succesfull
	 */
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
			handleError(error, "Error registering new user");
		} finally {
			set({ isRegistering: false });
		}
	},
	/**
	 * @objective async function to request api to logout user
	 * @effect settes user to null if succesfull
	 */
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
			handleError(error, "Error logging out user");
		}
	},
	/**
	 * @objective async function to request api to verify email
	 * @param form data for verifying email (otp?)
	 * @returns (already | sent | verified )sate of verification of email
	 * @effect updates user state to new user data
	 */
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
				});
				toast.success(res.data.data.message, { className: "toast" });
				return "verified";
			}
		} catch (error) {
			handleError(error, "Error verifing email");
		} finally {
			set({ isVerifingEmail: false });
		}
	},
	/**
	 * @objective async function to request api to update user
	 * @param form data to update user (name?,email?,avatar?,org?)
	 * @effect updates user with new data
	 */
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
			handleError(error, "Error updating user");
		} finally {
			set({ isUpdatingUser: false });
		}
	},
	/**
	 * @objective async function to request api to send forgot password email
	 * @param form data to send forgot password request (email)
	 */
	sendForgotPassword: async (form) => {
		try {
			set({ isSendingForgotPassword: true });
			const res = await axinstance.post<{
				status: string;
				data: { message: string };
			}>("/v1/auth/forgotPassword", form);
			toast.success(res.data.data.message, { className: "toast" });
		} catch (error) {
			handleError(error, "Error sending forgotpassword mail");
		} finally {
			set({ isSendingForgotPassword: false });
		}
	},
	/**
	 * @objective async function to request api to reset pasword after user forgot
	 * @param resetToken token user got on email
	 * @param form data for request (new password,confirm new password)
	 * @effect updates user with new data
	 */
	resetPassword: async (resetToken, form) => {
		try {
			if (!resetToken.trim()) {
				toast.error("Invalid password reset url",{className:"toast"});
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
			handleError(error, "Error sending reset mail");
		} finally {
			set({ isResettingPassword: true });
		}
	},
	/**
	 * @objective async function to request api to change user password
	 * @param form data to change password (prev password,new password,confirm new password)
	 * @effect updates user with new data
	 */
	changePassword: async (form) => {
		try {
			set({ isChangingPassword: true });
			const res = await axinstance.post<{
				status: string;
				data: { user: User };
			}>("/v1/users/updatePassword", form);

			set({ user: res.data.data.user });
			toast.success("Password changes successfully", {
				className: "toast",
			});
		} catch (error) {
			handleError(error, "Error changing password");
		} finally {
			set({ isChangingPassword: false });
		}
	},
	/**
	 * @objective async function to request api to delete user
	 * @effect sets user to null
	 */
	deleteUser: async () => {
		try {
			set({ isDeleteingUser: true });
			await axinstance.delete("/v1/users/updateMe");
			toast.success("User deleted successfully",{className:"toast"})
		} catch (error) {
			handleError(error, "Error deleting user");
		} finally {
			set({ isDeleteingUser: false });
		}
	},
}));

export default useAuthStore;
