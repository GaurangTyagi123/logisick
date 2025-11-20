import ItemsTable from "@/components/ItemsTable";
import AddItemModal from "@/components/modals/item/AddItemModal";
import ReportBar from "@/components/ReportBar";
import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";
import Button from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { H3, Large } from "@/components/ui/Typography";
import useGetReport from "@/hooks/item/useGetReport";
import { getOrganization } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

function ProductManagement() {
	const [openAddItemModal, setOpenAddItemModal] = useState<boolean>(false);
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	const { report, isPending: isGettingReport } = useGetReport(orgData?._id);

	if (isGettingOrg)
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
			<div className="grid w-full md:flex md:items-center md:justify-between gap-2 p-3 rounded-2xl bg-white dark:bg-ls-bg-dark-800 outline-1">
				<H3>Product Management</H3>
				<Button onClick={() => setOpenAddItemModal(true)}>
					Add New Item
				</Button>
			</div>
			{/* main menu */}
			<main className="w-full grid gap-2 rounded-2xl h-full">
				{/* Reports */}
				<div className="outline-1 p-3 rounded-2xl flex flex-col gap-2 w-full">
					<Large>Items Summary</Large>
					{report ? (
						<div className="grid gap-2">
							<div className="grid grid-cols-1 md:grid-cols-3 w-full gap-2">
								<ReportBar
									name="No. of Items"
									value={report.numOfItems}
									variant={"outline"}
								/>
								<ReportBar
									name="Total Quantity"
									value={report.totalQuantity}
									variant={"outline"}
									/>
								<ReportBar
									name="Avg. Quantity per Item"
									value={report.averageQuantity}
									variant={"outline"}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
								<ReportBar
									name="Total Cost Price"
									value={report.totalCostPrice}
									suffix="INR"
									currency
									variant={"secondary"}
								/>
								<ReportBar
									name="Total Selling Price"
									value={report.totalSellingPrice}
									suffix="INR"
									currency
									variant={"secondary"}
								/>
							</div>
							<div className="grid grid-cols-1 md:grid-cols-2 w-full gap-2">
								<ReportBar
									name="Avg. Cost Price"
									value={report.averageCostPrice}
									suffix="INR"
									currency
									variant={"secondary"}
								/>
								<ReportBar
									name="Avg. Selling Price"
									value={report.averageSellingPrice}
									suffix="INR"
									currency
									variant={"secondary"}
								/>
							</div>
						</div>
					) : isGettingReport ? (
						<div className="w-full">
							<Skeleton className="w-full h-30" />
						</div>
					) : (
						<Large className="w-full">No Report Found</Large>
					)}
				</div>
				{/* item table */}
				<ItemsTable />
			</main>
			<AddItemModal
				open={openAddItemModal}
				setOpen={setOpenAddItemModal}
			/>
		</div>
	);
}

export default ProductManagement;
