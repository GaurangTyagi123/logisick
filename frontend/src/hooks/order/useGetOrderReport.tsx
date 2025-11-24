import { getOrdersReport } from "@/services/apiOrder";
import { useQuery } from "@tanstack/react-query";

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
