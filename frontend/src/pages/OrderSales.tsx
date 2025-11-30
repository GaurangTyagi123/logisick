import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";
import OrdersTable from "@/components/OrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, Large } from "@/components/ui/Typography";
import useGetOrdersReport from "@/hooks/order/useGetOrderReport";
import { getOrganization } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ReportBar from "@/components/ReportBar";
import type { OrderReportType } from "@/services/apiOrder";

/**
 * @component page to server as endpoint for order and sales
 * @author `Ravish Ranjan`
 */
function OrderSales() {
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	const { report, isGettingOrdersReport } = useGetOrdersReport(orgData?._id);

	if (isGettingOrg || isGettingOrdersReport)
		return (
			<div className="flex flex-col gap-2  items-baseline h-full w-autorounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
				<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-3 rounded-2xl">
					<div className="flex flex-col md:flex-row justify-between items-center w-full">
						<Skeleton className="w-1/3 h-10" />
						<div className="flex gap-2">
							<Skeleton className="h-18 w-18" />
							<Skeleton className="h-18 w-18" />
						</div>
					</div>
					<Skeleton className="w-1/2 h-5" />
				</div>
				<div className="outline-1 p-4  w-full rounded-2xl">
					<Skeleton className="w-full h-15" />
				</div>
				<CustomTableSkeleton />
			</div>
		);
	return (
		<div className="grid gap-2 w-full">
			{/* top tab */}
			<div className="grid w-full md:flex md:items-center md:justify-between gap-2 p-1 md:p-3 rounded-lg md:rounded-2xl bg-white dark:bg-ls-bg-dark-800 outline-1">
				<H3>Orders / Sales Management</H3>
			</div>
			{/* main section */}
			<main className="w-full grid gap-2 rounded-lg md:rounded-2xl h-full">
				{/* report */}
				<div className="outline-1 p-3 rounded-lg md:rounded-2xl flex flex-col gap-2 w-full bg-white dark:bg-ls-bg-dark-800">
					<Large>Orders Summary</Large>
					{report ? (
						<div className="grid gap-2 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
							<ReportBar<OrderReportType>
								name="No. of Orders"
								value={report.totalOrders}
								variant={"outline"}
							/>
							<ReportBar<OrderReportType>
								name="Total Quantity"
								value={report.totalQuantity}
								variant={"outline"}
							/>
							<ReportBar<OrderReportType>
								name="Total Value"
								value={report.totalRevenue}
								currency
								variant={"secondary"}
								className="lg:col-span-1 md:col-span-2"
							/>
						</div>
					) : isGettingOrdersReport ? (
						<div className="w-full">
							<Skeleton className="w-full h-30" />
						</div>
					) : (
						<Large className="w-full">No Report Found</Large>
					)}
				</div>
				{/* order table */}
				<OrdersTable />
			</main>
		</div>
	);
}

export default OrderSales;
