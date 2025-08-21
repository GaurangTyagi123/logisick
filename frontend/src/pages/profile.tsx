import { useParams } from "react-router-dom";

function Profile() {
	const userId = useParams().userId || "Default User";
	return (
		<div>
			<h2>Profile</h2>
			<div>User Id : {userId}</div>
		</div>
	);
}

export default Profile;
