import { checkEmployeeStatus } from "@/services/apiItem"
import { useQuery } from "@tanstack/react-query"


function useIsEmployee(orgSlug:string) {
    const { data: isEmployee, isPending } = useQuery({
        queryKey: ['employee-status'],
        queryFn: ()=>checkEmployeeStatus(orgSlug)
    })
    return { isEmployee, isPending }
}

export default useIsEmployee
