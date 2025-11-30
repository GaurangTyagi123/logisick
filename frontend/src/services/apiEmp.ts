import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";
import { toast } from "react-toastify";

type sendInvite = (
	empEmail: string,
	role: "Admin" | "Manager" | "Staff",
) => Promise<{ message: string } | void>;

type acceptInvite = (token: string) => Promise<Emp | void>;

type changeRole = (
	orgid: string,
	newRole: "Admin" | "Manager" | "Staff",
	userid: string
) => Promise<Emp | void>;

type changeManager = (
	userid: string,
	managerEmail: string,
	orgid: string
) => Promise<Emp | void>;

type deleteEmployee = (userid: string, orgid: string) => Promise<void>;

/**
 * @brief async function to request api to send invite to user
 * @param {string} empEmail email of employee wanted to invite
 * @param {string} role role of employee invited as
 * @return {{message:string}} message data
 * @effect raises toast on failiure
 * @author `Ravish Ranjan`
 */
export const sendInvite: sendInvite = async (empEmail, role) => {
	try {
		const res = await axinstance.post<{
			status: "success" | "fail";
			data: { message: string };
		}>("/v1/emp/sendInvite", {
			empEmail,
			role,
		});
		if (res.data.status === "success") {
			return res.data.data;
		} else {
			toast.error("Error sending invite to new employee", {
				className: "toast",
			});
		}
	} catch (error) {
		console.log(error)
		handleError(error, "Error sending envite to new employee");
	}
};

/**
 * @brief async function to request api to accept invite by new user
 * @param {string} token invitation token sent on email to user
 * @returns {Emp} data of new employee
 * @author `Ravish Ranjan`
 */
export const acceptInvite: acceptInvite = async (token) => {
	try {
		const res = await axinstance.post<{
			status: string;
			data: { emp: Emp };
		}>("/v1/emp/acceptInvite", { token });
		if (res.status === 201) {
			return res.data.data.emp;
		}
	} catch (error) {
		if (error instanceof Error) handleError(error);
	}
};

/**
 * @brief async function to request api to change role of employee
 * @param orgid organization's id
 * @param newRole new roleof the user
 * @param userid user's id
 * @returns {Emp} data of new employee
 * @author `Ravish Ranjan`
 */
export const changeRole: changeRole = async (orgid, newRole, userid) => {
	try {
		const res = await axinstance.patch<{
			status: string;
			data: { emp: Emp };
		}>(`/v1/emp/${orgid}/changeRole`, {
			newRole,
			userid,
		});
		if (res.status === 200) {
			return res.data.data.emp;
		}
	} catch (error) {
		if (error instanceof Error) handleError(error);
	}
};

/**
 * @brief async function to request api to check user authentication
 * @param userid user'd id
 * @param managerEmail user's manager's email
 * @param orgid organizarion's id
 * @returns {Emp} data of new employee
 * @author `Ravish Ranjan`
 */
export const changeManager: changeManager = async (
	userid,
	managerEmail,
	orgid
) => {
	try {
		const res = await axinstance.patch<{
			status: string;
			data: { emp: Emp };
		}>(`/v1/emp/${orgid}/changeManager`, {
			userid,
			managerEmail,
		});
		if (res.status === 200) {
			return res.data.data.emp;
		}
	} catch (error) {
		if (error instanceof Error) handleError(error);
	}
};

/**
 * @brief async function to request api to check user authentication
 * @param userid user's id
 * @param orgid organization's id
 * @effect raises toast on success/failiure
 * @author `Ravish Ranjan`
 */
export const deleteEmployee: deleteEmployee = async (userid, orgid) => {
	try {
		const res = await axinstance.delete(`/v1/emp/${orgid}/delete`, {
			data: {
				userid,
			},
		});
		if (res.status === 204) {
			toast.success("Employee deleted successfully", {
				className: "toast",
			});
		}
	} catch (error) {
		handleError(error, "There was an error deleting employee");
	}
};
