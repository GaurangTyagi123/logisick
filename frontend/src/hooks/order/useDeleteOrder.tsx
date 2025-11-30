import { deleteOrderById } from "@/services/apiOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @brief hook to delete order
 * @returns {Function} `deleteOrderFn` - function to delete order request
 * @returns {boolean} `isDeletingOrderFn` - pending state of request
 * @author `Ravish Ranjan`
 */
function useDeleteOrder() {
	const queryClient = useQueryClient();
	const { mutate: deleteOrderFn, isPending: isDeletingOrder } = useMutation({
		mutationFn: deleteOrderById,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["orders", "orders-report"].includes(
						query.queryKey[0]?.toString() || ""
					),
			});
			queryClient.invalidateQueries();
			toast.success("Order deleted successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { deleteOrderFn, isDeletingOrder };
}

export default useDeleteOrder;
