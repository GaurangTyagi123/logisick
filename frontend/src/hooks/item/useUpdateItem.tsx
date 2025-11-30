import { updateItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @brief hook to update item data
 * @returns {Function} `updateItemFn` - function to update item request
 * @returns {boolean} `isUpdatingItem` - pending state of request
 * @author `Ravish Ranjan`
 */
function useUpdateItem() {
	const queryClient = useQueryClient();
	const { mutate: updateItemFn, isPending: isUpdatingItem } = useMutation({
		mutationFn: updateItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["item","items", "items-report"].includes(
						query.queryKey[0]?.toString() || ""
					),
			});
			toast.success("Item updated successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { updateItemFn, isUpdatingItem };
}

export default useUpdateItem;
