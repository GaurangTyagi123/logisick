import { updateItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useUpdateItem() {
	const queryClient = useQueryClient();
	const { mutate: updateItemFn, isPending } = useMutation({
		mutationFn: updateItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["items"],
			});
			toast.success("Item updated successfully", { className: "toast" });
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});
	return { updateItemFn, isPending };
}

export default useUpdateItem;
