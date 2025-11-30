import { updatePassword } from "@/services/apiUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useLogout from "./useLogout";

/**
 * @brief hook to update password of user
 * @returns {Function} `updatePasswordFn` - function update password of user request
 * @returns {boolean} `isUpdatingPassword` - pending state of request
 * @author `Ravish Ranjan`
 */
function useUpdatePassword() {
	const queryClient = useQueryClient();
	const { logoutFn: logout, isLoggingOut } = useLogout("Please Login again");
	const { mutate: updatePasswordFn, isPending: isUpdatingPassword } =
		useMutation({
			mutationFn: updatePassword,
			onSuccess: () => {
				toast.success("Password changes successfully", {
					className: "toast",
				});
				queryClient.invalidateQueries({
					queryKey: ["user"],
				});
				logout();
			},
			onError: (err) => {
				toast.error(err.message, { className: "toast" });
			},
		});
	return {
		updatePasswordFn,
		isUpdatingPassword: isUpdatingPassword || isLoggingOut,
	};
}

export default useUpdatePassword;
