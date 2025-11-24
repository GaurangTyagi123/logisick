import { getItem } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

function useGetItem(SKU: string) {
	const { data: item, isPending:isGettingItem } = useQuery({
		queryKey: ["item",SKU],
		queryFn: () => getItem(SKU),
		staleTime: 0
	});
	return { item, isGettingItem };
}

export default useGetItem;
