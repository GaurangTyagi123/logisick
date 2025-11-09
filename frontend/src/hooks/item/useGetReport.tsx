import { getReport } from "@/services/apiItem";
import { useQuery } from "@tanstack/react-query";

function useGetReport(orgId: string) {
	const {
		data: report,
		isPending,
		isError,
		error,
	} = useQuery({
		queryKey: ["report", orgId],
		queryFn: () => getReport(orgId),
		enabled: !!orgId,
	});
	return { report, isPending, isError, error };
}

export default useGetReport;
