import { deleteItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useDeleteItem() {
	const queryClient = useQueryClient();
	const { mutate: deleteItemFn, isPending } = useMutation({
		mutationFn: deleteItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) => query.queryKey[0]?.toString() === "items",
			});
			toast.success("Item deleted successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { deleteItemFn, isPending };
}

export default useDeleteItem;
