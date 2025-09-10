import { useState } from "react";
import { useParams } from "react-router-dom";

/**
 * @objective page to use as dashboard for a organizations
 * @returns page/react component
 */
function Dashboard() {
	const [org, ] = useState<string>(
		useParams<string>().orgid || ""
	);

	return (
		<div>
			<h2>Dashboard</h2>
			<div>Organizatin Id : {org || "All orgs"}</div>
		</div>
	);
}

export default Dashboard;
