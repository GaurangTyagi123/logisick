import { createOrder } from "@/services/apiOrder";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useCreateOrder() {
	const queryClient = useQueryClient();
	const { mutate: createOrderFn, isPending: isCreatingOrder } = useMutation({
		mutationFn: createOrder,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString() === "orders",
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
