import { changeManager } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useChangeManager() {
	const queryClient = useQueryClient();
	const { mutate: changeEmpManager, isPending } = useMutation({
		mutationFn: ({
			userid,
			managerid,
			orgid,
		}: {
			userid: string;
			managerid: string;
			orgid: string;
		}) => changeManager(userid, managerid, orgid),
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString().startsWith("emps-") ?? false,
			});
			toast.success("Manager Changed successfully", {
				className: "toast",
			});
		},
		onError: (err: any) => toast.error(err.message, { className: "toast" }),
	});
	return { changeEmpManager, isPending };
}

export default useChangeManager;
