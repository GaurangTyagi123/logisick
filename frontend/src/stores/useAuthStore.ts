import axinstance from "@/utils/axios";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
// import { userDb } from "@/utils/db";
import { create } from "zustand";


interface AuthProps {
	isVerifingEmail: boolean;
	isDeleteingUser: boolean;
	verifyEmail: (form: {
		otp?: string;
	}) => Promise<"already" | "sent" | "verified" | undefined>;
	deleteUser: () => Promise<void>;
}

/**
 * @brief function to handle error for async API class to server or system error
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
 * @brief hook to handle user authentication functions 
 */
const useAuthStore = create<AuthProps>((set) => ({
	isVerifingEmail: false, // boolean value to tell if verifying email request is processing
	isDeleteingUser: false, // boolean value to tell if deleting userrequest is processing
	
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
	 * @brief async function to request api to delete user
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
