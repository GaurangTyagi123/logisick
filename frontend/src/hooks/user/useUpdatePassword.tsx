import { updatePassword } from "@/services/apiUser";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useLogout from "./useLogout";

/**
 * @brief hook to handle updating of password of user
 * @returns update password state of app from react-query
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
