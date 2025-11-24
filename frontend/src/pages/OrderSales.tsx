import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";
import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { H3 } from "@/components/ui/Typography";
import useGetOrdersReport from "@/hooks/order/useGetOrderReport";
import { getOrganization } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

function OrderSales() {
	const [openAddOrderModal, setOpenAddOrderModal] = useState<boolean>(false);
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
					<Skeleton className="w-full h-30" />
				</div>
				<CustomTableSkeleton />
			</div>
		);
	return (
		<div className="grid gap-2 w-full">
			{/* top tab */}
			<div className="grid w-full md:flex md:items-center md:justify-between gap-2 p-1 md:p-3 rounded-lg md:rounded-2xl bg-white dark:bg-ls-bg-dark-800 outline-1">
				<H3>Product Management</H3>
				<Button onClick={() => setOpenAddOrderModal(true)}>
					Add New Item
				</Button>
			</div>
		</div>
	);
}

export default OrderSales;
