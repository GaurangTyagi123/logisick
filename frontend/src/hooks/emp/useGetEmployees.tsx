import { getAllEmployees } from "@/services/apiOrg";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const PAGE_SIZE = 5;
/**
 * @brief hook to get all employees of organization
 * @param {string} orgid organization id of organization
 * @param {number} [page=1] page no. to limit and offset the data to request 
 * @returns {EmpType} `data` - data of employees
 * @returns {number} `count` - count of the data
 * @returns {boolean} `isGettingEmployees` - pending state of request
 * @author `Gaurang Tyagi`
 */
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
