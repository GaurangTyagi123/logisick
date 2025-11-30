import axinstance, { setAccessToken } from "@/utils/axios";
import { handleError } from "@/utils/handleError";
import { toast } from "react-toastify";


type PasswordResetForm = {
	password: string;
	confirmPassword: string;
};
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
	form: PasswordResetForm
) => Promise<User | undefined>;

/**
 * @brief async function to request api to check user authentication
 * @effect updates user state
 * @author `Gaurang Tyagi`
 */
export const checkAuth: checkAuth = async () => {
	try {
		const res = await axinstance.get<{ data: { user: User } }>(
			"v1/auth/isLoggedIn"
		);
		if (res.status === 200) {
			const user = res.data.data.user;
			return { user };
		}
		else {
			handleError("You are not logged in")
		}
	} catch (err) {
		handleError(err, "You are not logged in");
	}
};

/**
 * @brief async function to request api to register new user
 * @param {user-details} form data for registering (name,email,password,confirm password)
 * @effect updates user state if succesfull
 * @author `Gaurang Tyagi`
 */
export const signup: signup = async (form) => {
	try {
		// set({ isRegistering: true });
		const res = await axinstance.post<{
			status: string;
			accessToken: string;
			data: { user: User };
		}>("/v1/auth/signup", form);
		setAccessToken(res.data.accessToken);
		return res.data.data.user;
	} catch (error) {
		handleError(error, "Error registering new user");
	}
};

/**
 * @brief async function to request api to login user
 * @param {{email:string, password:string}} form data for login containing (email,password)
 * @effect updated user state if logged in successfully
 * @author `Gaurang Tyagi`
 */
export const login: login = async (form: {
	email: string;
	password: string;
}) => {
	try {
		const res = await axinstance.post<{
			status: string;
			accessToken: string;
			data: { user: User };
		}>("/v1/auth/login", form);
		setAccessToken(res.data.accessToken);
		return res.data.data.user;
	} catch (error) {
		handleError(error, "error logging in user");
	}
};

/**
 * @brief async function to request api to logout user
 * @effect settes user to null if succesfull
 * @author`Gaurang Tyagi`
 */
export const logout = async () => {
	try {
		const res = await axinstance.get<{ status: string }>("/v1/auth/logout");
		const status = res.data.status;
		if (status === "success") {
			return { status };
		} else {
			toast.error("Error Logging Out ", { className: "toast" });
		}
	} catch (error) {
		handleError(error, "Error logging out user");
	}
};
/**
 * @brief async function to request api to send forgot password email
 * @param {{email:string}}form data to send forgot password request (email)
 * @author `Gaurang Tyagi`
 */
export const sendForgotToken: sendForgotPassword = async (form) => {
	try {
		const res = await axinstance.post<{
			status: string;
			data: { message: string };
		}>("/v1/auth/forgotPassword", form);
		if (res.data.status === "success") return res.data.data;
		else {
			toast.error("Error resetting password", { className: "toast" });
		}
	} catch (error) {
		handleError(error, "Error sending forgotpassword mail");
	}
};

/**
 * @brief async function to request api to reset pasword after user forgot
 * @param {string} resetToken token user got on email
 * @param {PasswordResetForm} form data for request (new password,confirm new password)
 * @effect updates user with new data
 * @author `Gaurang Tyagi`
 */
export const resetPassword: resetPassword = async (resetToken, form) => {
	try {
		if (!resetToken.trim()) {
			toast.error("Invalid password reset url", { className: "toast" });
			return;
		}
		const res = await axinstance.patch<{
			status: string;
			data: { user: User };
		}>(`/v1/auth/resetPassword/${resetToken}`, form);
		if (res.data.status === "success") {
			return res.data.data.user;
		} else {
			throw new Error("Error in resetting password");
		}
	} catch (error) {
		handleError(error, "Error sending reset mail");
	}
};
