import { getAllItems } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

function useGetAllItems(orgId: string, page: number) {
	const { data: items, isPending } = useQuery({
		queryKey: ["items", page],
		queryFn: () => getAllItems(orgId, page),
	});
	return { items, isPending };
}

export default useGetAllItems;
