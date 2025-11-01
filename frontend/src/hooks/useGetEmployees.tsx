import { getAllEmployees } from "@/services/apiOrg";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function useGetEmployees(orgid: string, page: number = 1) {
	const queryClient = useQueryClient();
	const { data, isPending, error } = useQuery({
		queryKey: [`emps`, page],
		queryFn: () => getAllEmployees(orgid, page),
	});
	if (data)
		queryClient.prefetchQuery({
			queryKey: [`emps`, page + 1],
			queryFn: () => getAllEmployees(orgid, page + 1),
		});

	return { data: data?.emps, count: data?.count, isPending, error };
}

export default useGetEmployees;
