import { getItem } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

/**
 * @brief hook to get item by SKU
 * @param {string} SKU SKU of the item
 * @returns {Item} `item` - item data
 * @returns {boolean} `isGettingItem` - pending state of request
 * @author `Ravish Ranjan`
 */
function useGetItem(SKU: string) {
	const { data: item, isPending:isGettingItem } = useQuery({
		queryKey: ["item",SKU],
		queryFn: () => getItem(SKU),
		staleTime: 0
	});
	return { item, isGettingItem };
}

export default useGetItem;
