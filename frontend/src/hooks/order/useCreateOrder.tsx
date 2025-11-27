import { createOrder } from "@/services/apiOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @brief hook to create new order
 * @returns {Function} `createOrderFn` - function to create new order request
 * @returns {boolean} `isCreatingOrder` - pending state of request
 * @author `Ravish Ranjan`
 */
function useCreateOrder() {
	const queryClient = useQueryClient();
	const { mutate: createOrderFn, isPending: isCreatingOrder } = useMutation({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["orders", "orders-report"].includes(
						query.queryKey[0]?.toString() || ""
					),
			});
			toast.success("Order created successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message || "Error creating Order", {
				className: "toast",
			});
		},
	});
	return { createOrderFn, isCreatingOrder };
}

export default useCreateOrder;
