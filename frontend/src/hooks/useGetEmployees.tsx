import { getAllEmployees } from '@/services/apiOrganization';
import { useQuery } from '@tanstack/react-query';

function useGetEmployees(orgid:string) {
    const { data, isPending } = useQuery({
        queryKey: ['emps'],
        queryFn: ()=>getAllEmployees(orgid),
    });
    return {data,isPending}
}

export default useGetEmployees;
