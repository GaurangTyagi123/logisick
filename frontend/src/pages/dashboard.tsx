import { Navigate, useParams } from "react-router-dom";

/**
 * @objective page to use as dashboard for a organizations  
 * @returns page/react component
 */
function Dashboard() {
	const { orgId } = useParams<string>();

	if (!orgId) return <Navigate to={"/notfound"} />;
	return (
		<div>
			<h2>Dashboard</h2>
			<div>Organizatin Id : {orgId}</div>
		</div>
	);
}

export default Dashboard;
