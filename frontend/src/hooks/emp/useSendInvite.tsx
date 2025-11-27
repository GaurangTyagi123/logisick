import { sendInvite } from "@/services/apiEmp";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @brief hook to send invitation from organization
 * @returns {Function} `sendInvition` - function to send invitation request
 * @returns {boolean} `issendingInvitation` - pending state of request
 * @author `Ravish Ranjan`
 */
function useSendInvite() {
	const { mutate: sendInvitation, isPending:isSendingInvite } = useMutation({
		mutationFn: ({
			empEmail,
			role,
		}: {
			empEmail: string;
			role: "Admin" | "Manager" | "Staff";
		}) => sendInvite(empEmail, role),
		onSuccess: (data) => {
			toast.success(data?.message, { className: "toast" });
		},
		onError: (err: any) => toast.error(err.message, { className: "toast" }),
	});
	return { sendInvitation, isSendingInvite };
}

export default useSendInvite;
