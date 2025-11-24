import { getAllOrgs } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";

function useGetOrganizations() {
	const { data, isPending:isGettingOrganizations } = useQuery({
		queryKey: ["orgs"],
		queryFn: getAllOrgs,
	});
	return { data, isGettingOrganizations };
}

export default useGetOrganizations;
