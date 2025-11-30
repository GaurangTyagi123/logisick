import EmployeeTable from "@/components/EmployeeTable";
import { Badge } from "@/components/ui/badge";
import { H3, Muted, Small } from "@/components/ui/Typography";
import { getOrganization } from "@/services/apiOrg";
import { formatCurrency } from "@/utils/utilfn";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";
import Button from "@/components/ui/button";
import useGetItemsReport from "@/hooks/item/useGetItemsReport";
import useGetOrdersReport from "@/hooks/order/useGetOrderReport";

/**
 * @component page to server as endpoint for organization overview
 * @author `Ravish Ranjan`
 */
function OrgOverview() {
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	const { isGettingItemReport, report } = useGetItemsReport(orgData?._id);
	const { isGettingOrdersReport, report: orderReport } = useGetOrdersReport(
		orgData?._id
	);

	if (isGettingOrg || isGettingItemReport || isGettingOrdersReport) {
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
				<CustomTableSkeleton />
			</div>
		);
	}
	if (!orgData) return <p>Create your own organiztion</p>;
	return (
		<div className="grid gap-2 jet-brains rounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
			{/* org overview report */}
			<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-3 rounded-lg md:rounded-2xl">
				<div className="flex flex-col lg:flex-row justify-between items-center w-full">
					<H3 className="overflow-hidden text-ellipsis whitespace-nowrap w-full text-center md:text-start">
						{orgData.name}
					</H3>
					<div className="flex gap-4">
						<Small className="grid place-items-center gap-2 h-full p-2 text-center">
							Inventory Value
							<Badge className="p-2">
								{formatCurrency(
									report?.totalSellingPrice || 0,
									"INR"
								)}
							</Badge>
						</Small>
						<Small className="grid place-items-center gap-2 h-full p-2 text-center">
							Order Revenue
							<Badge className="p-2">
								{formatCurrency(
									orderReport?.totalRevenue || 0,
									"INR"
								)}
							</Badge>
						</Small>
					</div>
				</div>
				<Muted className="line-clamp-2 md:text-start text-center">
					{orgData.description}
				</Muted>
			</div>
			{orgData ? (
				<EmployeeTable orgid={orgData?._id} />
			) : (
				<div className="h-96 w-full flex flex-col justify-center items-center gap-3 outline-1">
					<H3>Your Organization doesn't have any employees</H3>
					<Button asChild>
						<Link to={"user-role"}>Add Employees</Link>
					</Button>
				</div>
			)}
		</div>
	);
}

export default OrgOverview;
