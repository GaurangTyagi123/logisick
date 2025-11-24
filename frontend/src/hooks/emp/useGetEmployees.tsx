import { getAllEmployees } from "@/services/apiOrg";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;
function useGetEmployees(orgid: string, page: number = 1) {
	const queryClient = useQueryClient();
	const { data, isPending:isGettingEmployees, error } = useQuery({
		queryKey: [`emps`, page],
		queryFn: () => getAllEmployees(orgid, page),
	});
	if (data && (PAGE_SIZE * (page + 1) < data.count))
		queryClient.prefetchQuery({
			queryKey: [`emps`, page + 1],
			queryFn: () => getAllEmployees(orgid, page + 1),
		});

	return { data: data?.emps, count: data?.count, isGettingEmployees, error };
}

export default useGetEmployees;	
