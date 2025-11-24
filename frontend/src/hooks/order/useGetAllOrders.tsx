import { getAllOrders } from "@/services/apiOrder";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;
function useGetAllOrders(orgId: string, page: number) {
	const queryClient = useQueryClient();
	const { data: ordersResponse, isPending:isGettingOrders } = useQuery({
		queryKey: ["orders", page],
		queryFn: () => getAllOrders(orgId,page),
	});
	if (ordersResponse && ((PAGE_SIZE * page + 1) < ordersResponse.count))
		queryClient.prefetchQuery({
			queryKey: [`orders`, page + 1],
			queryFn: () => getAllOrders(orgId, page + 1),
		});
	return { ordersResponse, isGettingOrders };
}

export default useGetAllOrders;
