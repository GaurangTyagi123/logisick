import { updateOrderById } from "@/services/apiOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useUpdateOrder(
	orderId: string,
	orderUpdates: { quantity: number; shipped: boolean; orderedOn: Date }
) {
	const queryClient = useQueryClient();
	const { mutate: updateOrderFn, isPending: isUpdatingOrder } = useMutation({
		mutationFn: () => updateOrderById(orderId, orderUpdates),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString().startsWith("order") || false,
			});
			toast.success("Order updated successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { updateOrderFn, isUpdatingOrder };
}

export default useUpdateOrder;
