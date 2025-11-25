import { getItemById } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

function useGetItemById(itemId: string) {
	const { data: item, isPending: isGettingItem } = useQuery({
		queryKey: ["item", itemId],
		queryFn: () => getItemById(itemId),
		staleTime: 0,
	});
	return { item, isGettingItem };
}

export default useGetItemById;
