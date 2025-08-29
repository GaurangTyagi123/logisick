import Dice from "@/assets/icons/dice";
import { Edit } from "@/assets/icons/Edit";
import { Verified } from "@/assets/icons/Verified";
import UserAvatar from "@/components/avatar";
import Navbar from "@/components/navbar";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { H2, H4, Large, Lead } from "@/components/ui/Typography";
import useAuthStore from "@/stores/useAuthStore";
import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";
import { useState } from "react";
import { Navigate } from "react-router-dom";

function Profile() {
	// const userId = useParams().userId || "Default User";
	const isDark = useModeStore().getTheme() == "dark";
	const { user } = useAuthStore();
	const [openModal, setOpenModal] = useState<boolean>(false);
	const [modalPic, setModalPic] = useState<string>(user?.avatar || "");

	if (!user) <Navigate to={"/"} />;

	function genProfileString(len: number) {
		const all =
			"abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
		let ret = "";
		for (let i = 0; i < len; i++) {
			ret += all[Math.floor(Math.random() * 62)];
		}
		setModalPic(ret);
	}

	function handleProfilePicChange() {
		setOpenModal(false);
	}

	return (
		<div
			className={clsx(
				"w-full p-4 h-auto min-h-screen flex flex-col gap-2 items-center relative",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			<Navbar />
			{/* User Bar */}
			<div
				className={clsx(
					"max-w-6xl p-4 w-full grid place-items-center md:flex gap-2 rounded-2xl shadow-2xl",
					isDark ? "bg-zinc-700" : "bg-gray-300"
				)}
			>
				<div className="w-40 h-40 grid place-items-center relative">
					<UserAvatar
						customSeed={user?.avatar || "12345678"}
						className="w-40 h-40"
					/>
					<Button
						size={"sm"}
						className="absolute right-2 bottom-2 rounded-full"
						onClick={() => {
							setOpenModal(true);
							setModalPic(user?.avatar || "12345678");
						}}
					>
						<Edit className="w-5 h-5" />
					</Button>
				</div>
				<div className="flex flex-col justify-between h-full">
					<div className="flex flex-col">
						<div className="flex gap-2 flex-row justify-center md:justify-start items-center">
							<H2 className="pb-0">{user?.name}</H2>
							{user?.isVerified && <Verified />}
						</div>
						<Large className="text-center md:text-start">
							{user?.email}
						</Large>
					</div>
					<Lead className="text-sm text-center md:text-start">
						Member since :{" "}
						{new Date(user?.createdAt ?? "").toDateString()}
					</Lead>
				</div>
			</div>
			{/* modal */}
			<div
				style={{ backgroundColor: "#00000088" }}
				className={clsx(
					"h-screen w-full absolute place-items-center",
					openModal ? "grid" : "hidden"
				)}
			>
				<div
					className={clsx(
						"max-w-3xl min-w-md p-4 rounded-2xl flex flex-col gap-2",
						isDark ? "bg-zinc-700" : "bg-zinc-300"
					)}
				>
					<span className="flex justify-between items-center">
						<H4>Change Profile Picture</H4>
						<Button onClick={() => setOpenModal(false)}>X</Button>
					</span>
					<div className="grid place-items-center gap-2">
						<UserAvatar
							customSeed={modalPic}
							className="w-40 h-40"
						/>
						<div className="flex gap-2 w-full">
							<Input
								type="text"
								autoFocus
								value={modalPic}
								className="text-lg font-semibold text-center"
								onChange={(e) =>
									setModalPic(e.target.value.trim())
								}
							/>
							<Button
								className="h-9 w-9 grid place-items-center"
								title="generate random"
								onClick={() =>
									genProfileString(
										Math.floor(Math.random() * 11) + 1
									)
								}
							>
								<Dice className="h-9 w-9" />
							</Button>
						</div>
						<Button
							className="front-semibold"
							onClick={handleProfilePicChange}
						>
							Seems Good!
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Profile;
