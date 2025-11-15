import { sendInvite } from "@/services/apiEmp";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useSendInvite() {
	const { mutate: sendInvitation, isPending } = useMutation({
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
	return { sendInvitation, isPending };
}

export default useSendInvite;
