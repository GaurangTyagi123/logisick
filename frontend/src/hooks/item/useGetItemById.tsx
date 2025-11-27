import { getItemById } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

/**
 * @brief hook to get item by id
 * @returns {ItemType} `item` - item data
 * @returns {boolean} `isGettingItem` - pending state of request
 * @author `Ravish Ranjan`
 */
function useGetItemById(itemId: string) {
	const { data: item, isPending: isGettingItem } = useQuery({
		queryKey: ["item", itemId],
		queryFn: () => getItemById(itemId),
		staleTime: 0,
	});
	return { item, isGettingItem };
}

export default useGetItemById;
