import EmployeeTable from "@/components/EmployeeTable";
import Loading from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { H3, Muted, Small } from "@/components/ui/Typography";
import { getOrganization } from "@/services/apiOrganization";
import { formatCurrency } from "@/utils/utilfn";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

// const empData = {
// 	labels: ["admin", "manager", "staff"],
// 	datasets: [
// 		{
// 			label: "No. of Employees",
// 			data: [5, 8, 10],
// 			backgroundColor: [
// 				"rgba(247, 54, 96, 0.2)",
// 				"rgba(54, 162, 235, 0.2)",
// 				"rgba(255, 206, 86, 0.2)",
// 			],
// 			borderColor: [
// 				"rgba(255, 99, 132, 1)",
// 				"rgba(54, 162, 235, 1)",
// 				"rgba(255, 206, 86, 1)",
// 			],
// 			borderWidth: 1,
// 		},
// 	],
// };

// const inventoryData = {
// 	labels: ["inventory1", "inventory2", "inventory3"],
// 	datasets: [
// 		{
// 			label: "Inventory Capacity %",
// 			data: [5, 8, 90],
// 			backgroundColor: [
// 				"rgba(247, 54, 96, 0.2)",
// 				"rgba(54, 162, 235, 0.2)",
// 				"rgba(255, 206, 86, 0.2)",
// 			],
// 			borderColor: [
// 				"rgba(255, 99, 132, 1)",
// 				"rgba(54, 162, 235, 1)",
// 				"rgba(255, 206, 86, 1)",
// 			],
// 			borderWidth: 1,
// 		},
// 	],
// };

function OrgOverview() {
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});

	if (isGettingOrg) return <Loading />;
	if (orgData) {
		return (
			<div className="flex flex-col gap-2 items-baseline h-full w-auto jet-brains rounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
				<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-3 rounded-2xl">
					<div className="flex flex-col md:flex-row justify-between items-center w-full">
						<H3 className="overflow-hidden text-ellipsis whitespace-nowrap w-full">
							{orgData.name}
						</H3>
						<div className="flex">
							<Small className="grid place-items-center gap-2 h-full p-2">
								Imports
								<Badge className="p-2">{formatCurrency(500000)}</Badge>
							</Small>
							<Small className="grid place-items-center gap-2 h-full p-2">
								Exports
								<Badge className="p-2">{formatCurrency(500000)}</Badge>
							</Small>
						</div>
					</div>
					<Muted className="overflow-hidden text-ellipsis whitespace-nowrap line-clamp-2">
						{orgData.description}
					</Muted>
				</div>
				{orgData && <EmployeeTable orgid={orgData?._id} />}
			</div>
		);
	} else return <p>Create your own organiztion</p>;
}

export default OrgOverview;
