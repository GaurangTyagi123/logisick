import { changeManager } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useChangeManager() {
	const queryClient = useQueryClient();
	const { mutate: changeEmpManager, isPending:isChangingManager } = useMutation({
		mutationFn: ({
			userid,
			managerEmail,
			orgid,
		}: {
			userid: string;
			managerEmail: string;
			orgid: string;
		}) => changeManager(userid, managerEmail, orgid),
		onSuccess: (_data) => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString() === "emps",
			});
			toast.success("Manager Changed successfully", {
				className: "toast",
			});
		},
		onError: (err: any) => toast.error(err.message, { className: "toast" }),
	});
	return { changeEmpManager, isChangingManager };
}

export default useChangeManager;
