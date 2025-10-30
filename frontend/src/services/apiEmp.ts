import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";
import { toast } from "react-toastify";

type sendInvite = (
	empEmail: string,
	role: "Admin" | "Manager" | "Staff",
	managerid?: string
) => Promise<{ message: string } | void>;

type acceptInvite = (token: string) => Promise<Emp | void>;

type changeRole = (
	orgid: string,
	newRole: "Admin" | "Manager" | "Staff",
	userid: string,
	managerid?: string
) => Promise<Emp | void>;

type changeManager = (
	userid: string,
	managerid: string,
	orgid: string
) => Promise<Emp | void>;

type deleteEmployee = (userid: string, orgid: string) => Promise<void>;

/**
 * @brief async function to request api to send invite to user
 * @return ({message:string}) message data
 * @effect raises toast on failiure
 */
export const sendInvite: sendInvite = async (empEmail, role, managerid) => {
	try {
		const res = await axinstance.post<{
			status: "success" | "fail";
			data: { message: string };
		}>("/v1/emp/sendInvite", {
			empEmail,
			role,
			managerid,
		});
		if (res.data.status === "success") {
			return res.data.data;
		} else {
			toast.error("Error sending invite to new employee", {
				className: "toast",
			});
		}
	} catch (error) {
		handleError(error, "Error sending envite to new employee");
	}
};

/**
 * @brief async function to request api to accept invite by new user
 * @returns (Emp) data of new employee
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
 * @returns (Emp) data of new employee
 */
export const changeRole: changeRole = async (
	orgid,
	newRole,
	userid,
	managerid
) => {
	try {
		const res = await axinstance.patch<{
			status: string;
			data: { emp: Emp };
		}>(`/v1/emp/${orgid}/changeRole`, {
			newRole,
			userid,
			managerid,
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
 * @returns (Emp) data of new employee
 */
export const changeManager: changeManager = async (
	userid,
	managerid,
	orgid
) => {
	try {
		const res = await axinstance.patch<{
			status: string;
			data: { emp: Emp };
		}>(`/v1/emp/${orgid}/changeManager`, {
			userid,
			managerid,
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
 * @effect raises toast on success/failiure
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
		handleError(error,"There was an error deleting employee");
	}
};
