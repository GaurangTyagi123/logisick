import { Verified } from "@/assets/icons/Verified";
import UserAvatar from "@/components/avatar";
import Navbar from "@/components/navbar";
import { H2, Large, Small } from "@/components/ui/Typography";
import useAuthStore from "@/stores/useAuthStore";
import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";
// import { useParams } from "react-router-dom";

function Profile() {
	// const userId = useParams().userId || "Default User";
	const isDark = useModeStore().getTheme() == "dark";
	const { user } = useAuthStore();

	return (
		<div
			className={clsx(
				"w-full p-4 h-auto min-h-screen flex flex-col gap-2 items-center",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			<Navbar />
			{/* User Bar */}
			<div
				className={clsx(
					"max-w-6xl p-4 w-full h-45 grid place-items-center md:flex gap-2 rounded-2xl shadow-2xl",
					isDark ? "bg-zinc-700" : "bg-gray-300"
				)}
			>
				<UserAvatar
					customSeed={user?.avatar || "12345678"}
					className="w-40 h-40"
				/>
				<div className="flex flex-col justify-between h-full">
					<div></div>
					<div className="flex flex-col">
						<div className="flex gap-2 flex-row justify-center md:justify-start items-center">
							<H2 className="pb-0">{user?.name}</H2>
							{user?.isVerified && <Verified />}
						</div>
						<Large className="text-center md:text-start">{user?.email}</Large>
					</div>
					<Small className="text-sm text-center md:text-start">
						Member since : {new Date().toDateString()}
					</Small>
				</div>
			</div>
		</div>
	);
}

export default Profile;
