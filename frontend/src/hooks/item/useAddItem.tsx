import { addItem } from "@/services/apiItem"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify";

function useAddItem() {
    const queryClient = useQueryClient();
    const { mutate: addItemFn, isPending } = useMutation({
        mutationFn: addItem,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['items']
            })
            toast.success("Item added successfully");
        },
        onError: (err) => {
            toast.error(err.message);
        }
    })
    return { addItemFn, isPending }
}

export default useAddItem
