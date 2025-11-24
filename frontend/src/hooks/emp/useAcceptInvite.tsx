import { acceptInvite } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function useAcceptInvite() {
	const queryClient = useQueryClient();
	const navigate = useNavigate();
	const { mutate: acceptInvitation, isPending:isAcceptingInvite } = useMutation({
		mutationFn: ({ token }: { token: string }) => acceptInvite(token),
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0]?.toString() === "emps",
			});
			toast.success("Invite Accepted", { className: "toast" });
			navigate("/dashboard");
		},
		onError: (err: any) => {
			toast.error(err.message, {
				className: "toast",
			});
		},
	});
	return { acceptInvitation, isAcceptingInvite };
}

export default useAcceptInvite;
