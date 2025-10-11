import { getAllEmployees } from '@/services/apiOrganization';
import { useQuery } from '@tanstack/react-query';

function useGetEmployees(orgid:string) {
    const { data, isPending,error } = useQuery({
        queryKey: ['emps'],
        queryFn: () => getAllEmployees(orgid),
        retry : false
    });
    return {data,isPending,error}
}

export default useGetEmployees;
