import { lazy, useEffect, useState } from "react";
import { toast, type Id } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import { Verified, Hint, Edit, Delete } from "@/assets/icons/Profilepage";

import Button from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import UserAvatar from "@/components/UserAvatar";
import { H2, Large, Muted } from "@/components/ui/Typography";

const OtpModal = lazy(() => import("@/components/modals/user/OtpModal"));
const DeleteMeModal = lazy(
	() => import("@/components/modals/user/DeleteMeModal")
);
const ChangePasswordModal = lazy(
	() => import("@/components/modals/user/ChangePasswordModal")
);
const ProfilePicChangeModal = lazy(
	() => import("@/components/modals/user/ProfilePicChangeModal")
);

import useAuthStore from "@/stores/useAuthStore";
import ProfileOrgTable from "@/components/ProfileOrgTable";
const DeleteOrgModal = lazy(
	() => import("@/components/modals/org/DeleteOrgModal")
);
const EditOrgModal = lazy(() => import("@/components/modals/org/EditOrgModal"));
const TransferOwnershipModal = lazy(
	() => import("@/components/modals/org/TransferOwnershipModal")
);
const UpdateUserModal = lazy(
	() => import("@/components/modals/user/UpdateUserModal")
);

/**
 * @component page to server as endpoint for profile page
 * @author `Ravish Ranjan`
 */
function Profile() {
	const { verifyEmail, isVerifingEmail } = useAuthStore();
	const queryClient = useQueryClient();
	const userData = queryClient.getQueryData(["user"]) as
		| { user?: User }
		| undefined;
	const user = userData?.user;

	const [openChangeProfilePic, setOpenChangeProfilePic] =
		useState<boolean>(false);
	const [openUpdateUser, setOpenUpdateUser] = useState<boolean>(false);
	const [openOtp, setOpenOtp] = useState<boolean>(false);
	const [openChangePassword, setOpenChangePassword] =
		useState<boolean>(false);
	const [openDeleteMe, setOpenDeleteMe] = useState<boolean>(false);
	const [openOrgDelete, setOrgDelete] = useState<boolean>(false);
	const [openEdit, setOpenEdit] = useState<boolean>(false);
	const [openTransfer, setOpenTransfer] = useState<boolean>(false);

	const [otp, setOtp] = useState<string>("");
	const [modalPic, setModalPic] = useState<string>(user?.avatar || "");

	if (!user) <Navigate to={"/"} />;


	// hook to notify to verify user
	useEffect(() => {
		let ts: Id;
		if (!user?.isVerified && !openOtp && !isVerifingEmail) {
			ts = toast.warning(
				<div className="grid h-auto">
					Your Email is not verified
					<Button
						variant={"default"}
						disabled={isVerifingEmail}
						onClick={async () => {
							const res = await verifyEmail({});
							if (res == "sent") {
								setOpenOtp(true);
								setOtp("");
							}
							toast.dismiss(ts);
						}}
					>
						Click to Verify
					</Button>
				</div>,
				{ className: "toast" }
			);
		}
		return () => toast.dismiss(ts);
	}, [isVerifingEmail, user?.isVerified, verifyEmail, openOtp]);

	return (
		<div className="w-full px-4 h-auto min-h-screen flex flex-col gap-2 items-center relative bg-ls-bg-200 dark:bg-ls-bg-dark-900 pb-10">
			<Navbar />
			{/* User Bar */}
			<div className="max-w-6xl p-4 w-full grid place-items-center md:flex gap-4 rounded-2xl shadow-2xl bg-white dark:bg-ls-bg-dark-800">
				<div className="w-40 h-40 grid place-items-center relative">
					<UserAvatar
						customSeed={user?.avatar || (user?.email as string)}
						className="w-40 h-40 ring-4 ring-offset-2 ring-ls-sec-500"
					/>
					<Button
						// size={"sm"}
						className="absolute right-2 bottom-2 rounded-full"
						onClick={() => {
							setOpenChangeProfilePic(true);
							setModalPic(
								user?.avatar || (user?.email as string)
							);
						}}
					>
						<Edit className="w-5 h-5" />
					</Button>
				</div>
				<div className="flex flex-col justify-between h-full">
					<div className="flex flex-col">
						<div className="flex gap-2 flex-row justify-center md:justify-start items-center text-ls-ter-800 dark:text-ls-ter-500">
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
											setOpenOtp(true);
											setOtp("");
										}
									}}
								>
									<Hint className="h-full w-full" />
								</Button>
							)}
						</div>
						<Large className="text-center md:text-start text-ls-sec-800 dark:text-ls-sec-400">
							{user?.email}
						</Large>
					</div>
					<Muted className="text-sm text-center md:text-start">
						Member since :{" "}
						{new Date(user?.createdAt ?? "").toLocaleDateString()}
					</Muted>
				</div>
			</div>
			{/* main */}
			<main className="max-w-6xl w-full flex flex-col-reverse md:flex-row gap-2 ">
				<ProfileOrgTable
					setDeleteOpen={setOrgDelete}
					setEditOpen={setOpenEdit}
					setOpenTransfer={setOpenTransfer}
				/>
				<div className="md:min-h-96 gap-2 grid  md:flex md:flex-col">
					<Button
						onClick={() => {
							if (user?.isVerified) {
								setOpenUpdateUser(true);
							} else {
								toast.error(
									"User must be verified to update information",
									{ className: "toast" }
								);
							}
						}}
						variant={"secondary"}
					>
						Update User
					</Button>
					<Button
						onClick={() => setOpenChangePassword(true)}
						variant={"secondary"}
					>
						Change Password
					</Button>
					<Button
						variant={"destructive"}
						onClick={() => setOpenDeleteMe(true)}
					>
						<Delete className="h-full aspect-square" />
						Delete Me
					</Button>
				</div>
			</main>

			{/* MODALS */}
			{/* profile-change modal */}
			<ProfilePicChangeModal
				open={openChangeProfilePic}
				setOpen={setOpenChangeProfilePic}
				modalPic={modalPic}
				setModalPic={setModalPic}
			/>
			{/* otp modal */}
			<OtpModal
				open={openOtp}
				setOpen={setOpenOtp}
				otp={otp}
				setOtp={setOtp}
			/>
			{/* change password modal */}
			<ChangePasswordModal
				open={openChangePassword}
				setOpen={setOpenChangePassword}
			/>
			{/* confirm delete modal */}
			<EditOrgModal setOpen={setOpenEdit} open={openEdit} />
			<TransferOwnershipModal
				open={openTransfer}
				setOpen={setOpenTransfer}
			/>
			<DeleteMeModal open={openDeleteMe} setOpen={setOpenDeleteMe} />
			<DeleteOrgModal
				open={openOrgDelete}
				setOpen={setOrgDelete}
				orgId={user?.myOrg?._id}
			/>
			<UpdateUserModal
				open={openUpdateUser}
				setOpen={setOpenUpdateUser}
			/>
		</div>
	);
}

export default Profile;
