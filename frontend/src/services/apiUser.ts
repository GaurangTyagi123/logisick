import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";

type UserUpdateForm = {
	name?: string;
	email?: string;
	avatar?: string;
};
type updateUser = (form: UserUpdateForm) => Promise<User | void>;

type changePassword = (form: {
	prevPassword: string;
	password: string;
	confirmPassword: string;
}) => Promise<User | void>;

/**
 * @brief async function to request api to update user
 * @param form data to update user 
 * ```
 * {
 * 		name?:string,
 * 		email?:string,
 * 		avatar?:string
 * }
 * ```
 * @effect updates user with new data
 * @return {User} updateduser
 * @author `Gaurang Tyagi`
 */
export const updateUser: updateUser = async (form) => {
	try {
		if (Object.keys(form).length === 0) {
			throw new Error("There is nothing to update");
		}
		const res = await axinstance.post<{
			status: string;
			data: { updatedUser: User };
		}>("/v1/users/updateMe", form);
		return res.data.data.updatedUser;
	} catch (error) {
		handleError(error, "Error updating user");
	}
};

/**
 * @brief async function to request api to change user password
 * @param form data to change password 
 * ```
 * {	
 * 		prevPassword:string, 
 * 		newPassword:string, 
 * 		confirmNewPassword:string
 * }
 * ```
 * @effect updates user with new data
 * @return {User} updated user data
 * @author `Gaurang Tyagi`
 */
export const updatePassword: changePassword = async (form) => {
	try {
		const res = await axinstance.post<{
			status: string;
			data: { user: User };
		}>("/v1/users/updatePassword", form);
		return res.data.data.user;
	} catch (error) {
		handleError(error, "Error changing password");
	}
};
