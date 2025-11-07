import { getAllItems } from "@/services/apiItem"
import { useQuery } from "@tanstack/react-query"

function useGetAllItems(orgId: string) {
    const { data: items, isPending } = useQuery({
        queryKey: ['items'],
        queryFn: () => getAllItems(orgId)
    })
    return { items, isPending }
}

export default useGetAllItems
