import { updateOrderById } from "@/services/apiOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useUpdateOrder() {
	const queryClient = useQueryClient();
	const { mutate: updateOrderFn, isPending: isUpdatingOrder } = useMutation({
		mutationFn: ({
			orderId,
			orderUpdated,
		}: {
			orderId: string;
			orderUpdated: {
				quantity?: number;
				shipped?: boolean;
				orderedOn?: Date;
			};
		}) => updateOrderById(orderId, orderUpdated),
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["items", "items-report"].includes(
						query.queryKey[0]?.toString() || ""
					),
			});
			toast.success("Order updated successfully", { className: "toast" });
		},
		onError: (err: any) => {
			toast.error(err?.message ?? "Failed to update order", {
				className: "toast",
			});
		},
	});
	return { updateOrderFn, isUpdatingOrder };
}

export default useUpdateOrder;
