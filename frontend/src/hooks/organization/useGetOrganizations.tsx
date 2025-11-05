import { getAllOrgs } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";

function useGetOrganizations() {
	const { data, isPending } = useQuery({
		queryKey: ["orgs"],
		queryFn: getAllOrgs,
	});
	return { data, isPending };
}

export default useGetOrganizations;
