import { deleteItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @brief hook to delete item
 * @returns {Function} `deleteItemFn` - function to delete item request
 * @returns {boolean} `isDeletingItem` - pending state of request
 * @author `Ravish Ranjan`
 */
function useDeleteItem() {
	const queryClient = useQueryClient();
	const { mutate: deleteItemFn, isPending: isDeletingItem } = useMutation({
		mutationFn: deleteItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["item","items", "items-report"].includes(
						query.queryKey[0]?.toString() || ""
					),
			});
			toast.success("Item deleted successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { deleteItemFn, isDeletingItem };
}

export default useDeleteItem;
