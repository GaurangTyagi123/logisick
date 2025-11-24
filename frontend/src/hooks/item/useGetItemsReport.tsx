import { getItemsReport } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

function useGetItemsReport(orgId: string) {
	const {
		data: report,
		isPending:isGettingItemReport,
		isError,
		error,
	} = useQuery({
		queryKey: ["items-report", orgId],
		queryFn: () => getItemsReport(orgId),
		enabled: !!orgId,
	});
	return { report, isGettingItemReport, isError, error };
}

export default useGetItemsReport;
