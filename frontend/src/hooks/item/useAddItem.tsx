import { addItem } from "@/services/apiItem";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

function useAddItem() {
	const queryClient = useQueryClient();
	const { mutate: addItemFn, isPending:isAddingItem } = useMutation({
		mutationFn: addItem,
		onSuccess: () => {
			queryClient.invalidateQueries({
				predicate: (query) =>
					query.queryKey[0]?.toString() === "items" ,
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
