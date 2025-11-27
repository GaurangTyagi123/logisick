import { getOrdersReport } from "@/services/apiOrder";
import { useQuery } from "@tanstack/react-query";

/**
 * @brief hook to get order report
 * @returns {report} `report` - function to get order report request
 * @returns {boolean} `isGettingOrderReport` - pending state of request
 * @author `Ravish Ranjan`
 */
function useGetOrdersReport(orgId: string) {
	const {
		data: report,
		isPending: isGettingOrdersReport,
		isError,
		error,
	} = useQuery({
		queryKey: ["orders-report", orgId],
		queryFn: () => getOrdersReport(orgId),
		enabled: !!orgId,
	});
	return { report, isGettingOrdersReport, isError, error };
}

export default useGetOrdersReport;
