import { updateItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useUpdateItem() {
	const queryClient = useQueryClient();
	const { mutate: updateItemFn, isPending: isUpdatingItem } = useMutation({
		mutationFn: updateItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					["items", "items-report"].includes(
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
