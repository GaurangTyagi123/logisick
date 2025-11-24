import { changeRole } from "@/services/apiEmp";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useChangeRole() {
	const queryClient = useQueryClient();
	const { mutate: changeEmpRole, isPending:isChangingRole } = useMutation({
		mutationFn: ({
			orgid,
			newRole,
			userid,
		}: {
			orgid: string;
			newRole: "Admin" | "Manager" | "Staff";
			userid: string;
		}) => changeRole(orgid, newRole, userid),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString() === "emps" ,
			});
			toast.success("Role changed successfully", { className: "toast" });
		},
		onError: (err: any) =>
			toast.error(err.message, {
				className: "toast",
			}),
	});
	return { changeEmpRole, isChangingRole };
}
export default useChangeRole;
