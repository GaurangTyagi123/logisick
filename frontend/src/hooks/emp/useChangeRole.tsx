import { changeRole } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useChangeRole() {
	const queryClient = useQueryClient();
	const { mutate: changeEmpRole, isPending } = useMutation({
		mutationFn: ({
			orgid,
			newRole,
			userid,
			managerid,
		}: {
			orgid: string;
			newRole: "Admin" | "Manager" | "Staff";
			userid: string;
			managerid?: string;
		}) => changeRole(orgid, newRole, userid, managerid),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString().startsWith("emps-") ?? false,
			});
			toast.success("Role changed successfully", { className: "toast" });
		},
		onError: (err: any) =>
			toast.error(err.message, {
				className: "toast",
			}),
	});
	return { changeEmpRole, isPending };
}
export default useChangeRole;
