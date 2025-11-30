import { checkEmployeeStatus } from "@/services/apiItem"
import { useQuery } from "@tanstack/react-query"

/**
 * @brief hook to send invitation from organization
 * @returns {Function} `sendInvition` - function to send invitation request
 * @returns {boolean} `isCheckingEmployment` - pending state of request
 * @author `Gaurang Tyagi`
 */
function useIsEmployee(orgSlug:string) {
    const { data: isEmployee, isPending:isCheckingEmployment } = useQuery({
        queryKey: ['employee-status'],
        queryFn: ()=>checkEmployeeStatus(orgSlug)
    })
    return { isEmployee, isCheckingEmployment }
}

export default useIsEmployee
