import { getItem } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

function useGetItem(SKU: string) {
	const { data: item, isPending } = useQuery({
		queryKey: ["item"],
		queryFn: () => getItem(SKU),
		staleTime: 0
	});
	return { item, isPending };
}

export default useGetItem;
