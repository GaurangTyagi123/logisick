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

interface AuthProps {
	user: User | null;
	isCheckingAuth: boolean;
	isLoggingIn: boolean;
	isRegistering: boolean;
	checkAuth: () => Promise<void>;
	login: (form: LoginForm) => Promise<void>;
	register: (form: RegisterForm) => Promise<void>;
	logout: () => Promise<void>;
}

const useAuthStore = create<AuthProps>((set) => ({
	user: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isRegistering: false,
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
}));

export default useAuthStore;
