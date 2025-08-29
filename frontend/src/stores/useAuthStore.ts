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

interface AuthProps {
	user: User | null;
	isCheckingAuth: boolean;
	isLoggingIn: boolean;
	isRegistering: boolean;
	isVerifingEmail: boolean;
	checkAuth: () => Promise<void>;
	login: (form: LoginForm) => Promise<void>;
	register: (form: RegisterForm) => Promise<void>;
	logout: () => Promise<void>;
	verifyEmail: (
		form: EmailForm
	) => Promise<"already" | "sent" | "verified" | undefined>;
}

const useAuthStore = create<AuthProps>((set, get) => ({
	user: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isRegistering: false,
	isVerifingEmail: false,
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
}));

export default useAuthStore;
