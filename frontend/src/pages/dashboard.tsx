import { Navigate, useParams } from "react-router-dom";

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
