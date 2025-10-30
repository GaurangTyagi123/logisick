import { acceptInvite } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useAcceptInvite() {
	const queryClient = useQueryClient();
	const { mutate: acceptInvitation, isPending } = useMutation({
		mutationFn: ({ token }: { token: string }) => acceptInvite(token),
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString().startsWith("emps-") ?? false,
			});
			toast.success("Invite Accepted", { className: "toast" });
		},
		onError: (err: any) => {
			toast.error(err.message, {
				className: "toast",
			});
		},
	});
	return { acceptInvitation, isPending };
}

export default useAcceptInvite;
