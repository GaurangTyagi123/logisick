import { getItemsReport } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

/**
 * @brief hook to get item report
 * @returns {Report} `report` - item report data
 * @returns {boolean} `isGettingItemReport` - pending state of request
 * @author `Ravish Ranjan`
 */
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
