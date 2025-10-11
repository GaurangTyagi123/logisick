
import EmployeeTable from "@/components/EmployeeTable";
import Loading from "@/components/Loading";
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
	const {data:orgData,isPending:isGettingOrg} = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	})
	

	if (isGettingOrg) return <Loading />
	if (orgData) {
		return (
			<div className="flex flex-col items-baseline h-full w-auto  jet-brains">
				<div className="flex flex-col md:flex-row justify-between items-baseline w-full outline outline-zinc-500 p-5 mt-3">
					<h1 className="text-2xl font-light tracking-widest p-2">
						{orgData.name}
					</h1>
					<div className="flex justify-evenly gap-3  md:w-[50%] w-full font-semibold text-2xl">
						<div className=" dark:bg-zinc-800 p-2 rounded-sm uppercase bg-red-400 text-white dark:text-green-500 tracking-widest">
							{formatCurrency(50000)} Imports
						</div>
						<div className=" dark:bg-zinc-800 p-2 rounded-sm uppercase bg-green-400 text-white dark:text-red-500 tracking-widest">
							{formatCurrency(150000)} Exports
						</div>
					</div>
				</div>
				<div className="tracking-wide md:text-md text-sm mt-3">
					{orgData.description}
				</div>
				{orgData && <EmployeeTable orgid={orgData?._id} />}
			</div>
		);
	} else return <p>Create your own organiztion</p>;
}

export default OrgOverview;
