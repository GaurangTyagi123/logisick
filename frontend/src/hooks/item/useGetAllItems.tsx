import { getAllItems } from "@/services/apiItem";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;
function useGetAllItems(orgId: string, page: number) {
	const queryClient = useQueryClient();
	const { data: itemsResponse, isPending:isGettingItems } = useQuery({
		queryKey: ["items", page],
		queryFn: () => getAllItems(orgId, page),
	});
	if (itemsResponse && ((PAGE_SIZE * page + 1) < itemsResponse.count))
		queryClient.prefetchQuery({
			queryKey: [`items`, page + 1],
			queryFn: () => getAllItems(orgId, page + 1),
		});
	return { itemsResponse, isGettingItems };
}

export default useGetAllItems;
