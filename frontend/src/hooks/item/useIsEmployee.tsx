import { checkEmployeeStatus } from "@/services/apiItem"
import { useQuery } from "@tanstack/react-query"


function useIsEmployee(orgSlug:string) {
    const { data: isEmployee, isPending:isCheckingEmployment } = useQuery({
        queryKey: ['employee-status'],
        queryFn: ()=>checkEmployeeStatus(orgSlug)
    })
    return { isEmployee, isCheckingEmployment }
}

export default useIsEmployee
