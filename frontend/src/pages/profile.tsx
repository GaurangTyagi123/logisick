import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Verified, Hint, Edit, Delete } from "@/assets/icons/Profilepage";

import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import UserAvatar from "@/components/UserAvatar";
import { H2, Large, Lead } from "@/components/ui/Typography";

import OtpModal from "@/components/modals/OtpModal";
import DeleteMeModal from "@/components/modals/DeleteMeModal";
import ChangePasswordModal from "@/components/modals/ChangePasswordModal";
import ProfilePicChangeModal from "@/components/modals/ProfilePicChangeModal";

import useAuthStore from "@/stores/useAuthStore";
import ProfileOrgTable from "@/components/ProfileOrgTable";
/**
 * @component a page to be used a profile page for users where they can modify their information
 * @returns page/react component
 */
function Profile() {
	const { verifyEmail, isVerifingEmail } = useAuthStore();
	const queryClient = useQueryClient();
	const userData = queryClient.getQueryData(["user"]) as
		| { user?: User }
		| undefined;
	const user = userData?.user;

	const [open1, setOpen1] = useState<boolean>(false);
	const [open2, setOpen2] = useState<boolean>(false);
	const [open3, setOpen3] = useState<boolean>(false);
	const [open4, setOpen4] = useState<boolean>(false);

	const [otp, setOtp] = useState<string>("");
	const [modalPic, setModalPic] = useState<string>(user?.avatar || "");

	if (!user) <Navigate to={"/"} />;

	useEffect(() => {
		if (!user?.isVerified && !open2 && !isVerifingEmail) {
			console.log(user?.isVerified, isVerifingEmail);
			const warning = toast.warning(
				<div className="grid h-auto">
					Your Email is not verified
					<Button
						variant={"default"}
						disabled={isVerifingEmail}
						onClick={async () => {
							const res = await verifyEmail({});
							if (res == "sent") {
								setOpen2(true);
								setOtp("");
							}
							toast.dismiss(warning);
						}}
					>
						Click to Verify
					</Button>
				</div>,
				{ className: "toast" }
			);
		}
		return toast.dismiss;
	}, [isVerifingEmail, user?.isVerified, verifyEmail, open2]);

	return (
		<div className="w-full px-4 h-auto min-h-screen flex flex-col gap-2 items-center relative dark:bg-zinc-900">
			<Navbar />
			{/* User Bar */}
			<div className="max-w-6xl p-4 w-full grid place-items-center md:flex gap-4 rounded-2xl shadow-2xl bg-zinc-300 dark:bg-zinc-700">
				<div className="w-40 h-40 grid place-items-center relative">
					<UserAvatar
						customSeed={user?.avatar || "12345678"}
						className="w-40 h-40 ring-2 ring-offset-2"
					/>
					<Button
						size={"sm"}
						className="absolute right-2 bottom-2 rounded-full"
						onClick={() => {
							setOpen1(true);
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
							{user?.isVerified ? (
								<Verified />
							) : (
								<Button
									variant={"ghost"}
									disabled={isVerifingEmail}
									title="verify your email"
									className="grid place-items-center p-0"
									onClick={async () => {
										const res = await verifyEmail({});
										if (res == "sent") {
											setOpen2(true);
											setOtp("");
										}
									}}
								>
									<Hint className="h-full w-full" />
								</Button>
							)}
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
			{/* main */}
			<main className="max-w-6xl p-4 w-full flex flex-col-reverse md:grid md:grid-cols-5 gap-2 ">
				<ProfileOrgTable />
				<div className="md:min-h-96 gap-2 flex flex-wrap md:flex-nowrap md:flex-col">
					<Button onClick={() => setOpen3(true)} className="">
						Change Password
					</Button>
					<Button
						variant={"destructive"}
						onClick={() => setOpen4(true)}
					>
						<Delete className="h-full aspect-square" />
						Delete Me
					</Button>
				</div>
			</main>

			{/* MODALS */}
			{/* profile-change modal */}
			<ProfilePicChangeModal
				open={open1}
				setOpen={setOpen1}
				modalPic={modalPic}
				setModalPic={setModalPic}
			/>
			{/* otp modal */}
			<OtpModal
				open={open2}
				setOpen={setOpen2}
				otp={otp}
				setOtp={setOtp}
			/>
			{/* change password modal */}
			<ChangePasswordModal open={open3} setOpen={setOpen3} />
			{/* confirm delete modal */}
			<DeleteMeModal open={open4} setOpen={setOpen4} />
		</div>
	);
}

export default Profile;
