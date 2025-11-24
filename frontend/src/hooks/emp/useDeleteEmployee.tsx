import { deleteEmployee } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useDeleteEmployee() {
	const queryClient = useQueryClient();
	const { mutate: deleteEmp, isPending:isDeletingEmployee } = useMutation({
		mutationFn: ({ userid, orgid }: { userid: string; orgid: string }) =>
			deleteEmployee(userid, orgid),
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0]?.toString() === "emps",
			});
			toast.success("Employee deleted successfully", {
				className: "toast",
			});
		},
		onError: (err: any) => toast.error(err.message, { className: "toast" }),
	});
	return { deleteEmp, isDeletingEmployee };
}

export default useDeleteEmployee;
