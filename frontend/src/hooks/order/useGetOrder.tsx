import { getOrderById, getOrderByName } from "@/services/apiOrder";
import { useQuery } from "@tanstack/react-query";

export function useGetOrderById(orderId: string) {
	const { data: order, isPending: isGettingOrderById } = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getOrderById(orderId),
		staleTime: 0,
	});
	return { order, isGettingOrderById };
}

export function useGetOrderByName(orderName: string) {
	const { data: order, isPending: isGettingOrderByName } = useQuery({
		queryKey: ["order", orderName],
		queryFn: () => getOrderByName(orderName),
		staleTime: 0,
	});
	return { order, isGettingOrderByName };
}
