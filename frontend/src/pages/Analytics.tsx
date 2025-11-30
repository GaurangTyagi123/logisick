import ReportBar from "@/components/ReportBar";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, Large } from "@/components/ui/Typography";
import useGetItemsReport from "@/hooks/item/useGetItemsReport";
import useGetOrdersReport from "@/hooks/order/useGetOrderReport";
import type { ItemReportType } from "@/services/apiItem";
import type { OrderReportType } from "@/services/apiOrder";
import { getOrganization } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

/**
 * @component page to server as endpoint for analytics of organization
 * @author `Ravish Ranjan`
 */
function Analytics() {
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	const { report: itemReport, isGettingItemReport } = useGetItemsReport(
		orgData?._id
	);
	const { report: orderReport, isGettingOrdersReport } = useGetOrdersReport(
		orgData?._id
	);

	if (isGettingOrg || isGettingItemReport)
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
					<Skeleton className="w-full h-30" />
				</div>
				<div className="outline-1 p-4  w-full rounded-2xl">
					<Skeleton className="w-full h-15" />
				</div>
			</div>
		);
	return (
		<div className="grid gap-2 w-full">
			{/* top tab */}
			<div className="grid w-full md:flex md:items-center md:justify-between gap-2 p-1 md:p-3 rounded-lg md:rounded-2xl bg-white dark:bg-ls-bg-dark-800 outline-1">
				<H3>Analytics</H3>
			</div>
			{/* main */}
			<main className="w-full grid gap-2 rounded-lg md:rounded-2xl h-full">
				{/* item symmary */}
				<div className="outline-1 p-3 rounded-lg md:rounded-2xl flex flex-col gap-2 w-full bg-white dark:bg-ls-bg-dark-800">
					<Large>Items Summary</Large>
					{itemReport ? (
						<div className="grid gap-2">
							<div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
								<ReportBar<ItemReportType>
									name="No. of Items"
									value={itemReport.numOfItems}
									variant={"outline"}
								/>
								<ReportBar<ItemReportType>
									name="Total Quantity"
									value={itemReport.totalQuantity}
									variant={"outline"}
								/>
								<ReportBar<ItemReportType>
									name="Avg. Quantity per Item"
									value={itemReport.averageQuantity}
									variant={"outline"}
								/>
							</div>
							<div className="grid gap-2 w-full grid-cols-1 2xl:grid-cols-2">
								<div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
									<ReportBar<ItemReportType>
										name="Total Cost Price"
										value={itemReport.totalCostPrice}
										suffix="INR"
										currency
										variant={"secondary"}
									/>
									<ReportBar<ItemReportType>
										name="Total Selling Price"
										value={itemReport.totalSellingPrice}
										suffix="INR"
										currency
										variant={"secondary"}
									/>
								</div>
								<div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
									<ReportBar<ItemReportType>
										name="Avg. Cost Price"
										value={itemReport.averageCostPrice}
										suffix="INR"
										currency
										variant={"secondary"}
									/>
									<ReportBar<ItemReportType>
										name="Avg. Selling Price"
										value={itemReport.averageSellingPrice}
										suffix="INR"
										currency
										variant={"secondary"}
									/>
								</div>
							</div>
						</div>
					) : isGettingItemReport ? (
						<div className="w-full">
							<Skeleton className="w-full h-30" />
						</div>
					) : (
						<Large className="w-full">No Report Found</Large>
					)}
				</div>
				{/* order summary */}
				<div className="outline-1 p-3 rounded-lg md:rounded-2xl flex flex-col gap-2 w-full bg-white dark:bg-ls-bg-dark-800">
					<Large>Orders Summary</Large>
					{orderReport ? (
						<div className="grid gap-2 grid-cols-1 lg:grid-cols-3 md:grid-cols-2">
							<ReportBar<OrderReportType>
								name="No. of Orders"
								value={orderReport.totalOrders}
								variant={"outline"}
							/>
							<ReportBar<OrderReportType>
								name="Total Quantity"
								value={orderReport.totalQuantity}
								variant={"outline"}
							/>
							<ReportBar<OrderReportType>
								name="Total Value"
								value={orderReport.totalRevenue}
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
			</main>
		</div>
	);
}

export default Analytics;
