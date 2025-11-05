import { lazy } from "react";
import EmployeeTable from "@/components/EmployeeTable";
import { Badge } from "@/components/ui/badge";
import { H3, Muted, Small } from "@/components/ui/Typography";
import { getOrganization } from "@/services/apiOrg";
import { formatCurrency } from "@/utils/utilfn";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { LazyLoad } from "@/components/LazyLoad";

function OrgOverview() {
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});

	if (isGettingOrg) return <LazyLoad />;
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
								<Badge className="p-2">
									{formatCurrency(500000)}
								</Badge>
							</Small>
							<Small className="grid place-items-center gap-2 h-full p-2">
								Exports
								<Badge className="p-2">
									{formatCurrency(500000)}
								</Badge>
							</Small>
						</div>
					</div>
					<Muted className="overflow-hidden text-ellipsis whitespace-nowrap line-clamp-2">
						{orgData.description}
					</Muted>
				</div>
				{orgData ? <EmployeeTable orgid={orgData?._id} /> : <LazyLoad />}
			</div>
		);
	} else return <p>Create your own organiztion</p>;
}

export default OrgOverview;
