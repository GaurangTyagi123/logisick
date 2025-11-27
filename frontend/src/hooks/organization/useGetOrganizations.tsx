import { getAllOrgs } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";

/**
 * @brief hook to get organization of user
 * @returns {data} `data` - function to get organization of user request
 * @returns {boolean} `isGettingOrganizations` - pending state of request
 * @author `Gaurang Tyagi`
 */
function useGetOrganizations() {
	const { data, isPending:isGettingOrganizations } = useQuery({
		queryKey: ["orgs"],
		queryFn: getAllOrgs,
	});
	return { data, isGettingOrganizations };
}

export default useGetOrganizations;
