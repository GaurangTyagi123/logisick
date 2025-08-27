import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";
import { useParams } from "react-router-dom";

function Profile() {
	const userId = useParams().userId || "Default User";
	const isDark = useModeStore().getTheme() == "dark";
	return (
		<div
			className={clsx(
				"w-full p-4 h-auto min-h-screen",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			<h2>Profile</h2>
			<div>User Id : {userId}</div>
		</div>
	);
}

export default Profile;
