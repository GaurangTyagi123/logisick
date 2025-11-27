import { getOrderById, getOrderByName } from "@/services/apiOrder";
import { useQuery } from "@tanstack/react-query";

/**
 * @brief hook to get order by id
 * @returns {order} `order` - function to get order by id request
 * @returns {boolean} `isGettingOrderById` - pending state of request
 * @author `Ravish Ranjan`
 */
export function useGetOrderById(orderId: string) {
	const { data: order, isPending: isGettingOrderById } = useQuery({
		queryKey: ["order", orderId],
		queryFn: () => getOrderById(orderId),
		staleTime: 0,
	});
	return { order, isGettingOrderById };
}

/**
 * @brief hook to get order by name 
 * @returns {order} `sendInvition` - function to get order by name request
 * @returns {boolean} `isGettingOrderByName` - pending state of request
 * @author `Ravish Ranjan`
 */
export function useGetOrderByName(orderName: string) {
	const { data: order, isPending: isGettingOrderByName } = useQuery({
		queryKey: ["order", orderName],
		queryFn: () => getOrderByName(orderName),
		staleTime: 0,
	});
	return { order, isGettingOrderByName };
}
