import { addItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

/**
 * @brief hook to add item
 * @returns {Function} `addItemFn` - function to add item request
 * @returns {boolean} `isAddingItem` - pending state of request
 * @author `Ravish Ranjan`
 */
function useAddItem() {
	const queryClient = useQueryClient();
	const { mutate: addItemFn, isPending: isAddingItem } = useMutation({
		mutationFn: addItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["items", "items-report"].includes(
						query.queryKey[0]?.toString() || ""
					),
			});
			toast.success("Item added successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message || "Error adding item", {
				className: "toast",
			});
		},
	});
	return { addItemFn, isAddingItem };
}

export default useAddItem;
