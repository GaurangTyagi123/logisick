import { deleteOrderById } from "@/services/apiOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useDeleteOrder() {
	const queryClient = useQueryClient();
	const { mutate: deleteOrderFn, isPending:isDeletingOrder } = useMutation({
		mutationFn: deleteOrderById,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString() === "orders",
			});
			toast.success("Order deleted successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { deleteOrderFn, isDeletingOrder };
}

export default useDeleteOrder;
