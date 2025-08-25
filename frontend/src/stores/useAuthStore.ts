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
	token: string | null;
	user: User | null;
	isCheckingAuth: boolean;
	isLoggingIn: boolean;
	isRegistering: boolean;
	checkAuth: () => Promise<void>;
	login: (form: LoginForm) => Promise<void>;
	register: (form: RegisterForm) => Promise<void>;
}

const useAuthStore = create<AuthProps>((set, get) => ({
	token: (() => {
		const token = localStorage.getItem("AuthToken");
		if (token) {
			return token;
		} else {
			return null;
		}
	})(),
	user: null,
	isCheckingAuth: true,
	isLoggingIn: false,
	isRegistering: false,
	checkAuth: async () => {
		try {
			if (!get().token) return;
			set({ isCheckingAuth: true });
			const res = await axinstance.get("/v1/auth/checkAuth");
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
				user: User;
				message: string;
				token: string;
			}>("/v1/auth/login", form);
			set({ user: res.data.user });
			set({ token: res.data.token });
			localStorage.setItem("AuthToken", res.data.token);
			toast.success(res.data.message, { className: "toast" });
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
				msg: string;
				user: User;
				token: string;
			}>("/v1/auth/signup", form);
			set({ user: res.data.user });
			set({ token: res.data.token });
			toast.success("Registered successfully", { className: "toast" });
		} catch (error) {
			if (isAxiosError(error)) {
				const msg =
					error.response?.data?.msg || "Error registering user";
				console.log(msg);
				toast.error(msg, { className: "toast" });
			} else {
				console.log(error);
			}
		} finally {
			set({ isRegistering: false });
		}
	},
}));

export default useAuthStore;
