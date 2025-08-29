import Dice from "@/assets/icons/Dice";
import { Edit } from "@/assets/icons/Edit";
import { Hint } from "@/assets/icons/Hint";
import { Verified } from "@/assets/icons/Verified";
import UserAvatar from "@/components/avatar";
import Modal from "@/components/Modal";
import Navbar from "@/components/navbar";
import Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { H2, H4, Large, Lead } from "@/components/ui/Typography";
import useAuthStore from "@/stores/useAuthStore";
import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
	// const userId = useParams().userId || "Default User";
	const isDark = useModeStore().getTheme() == "dark";
	const { user, verifyEmail, isVerifingEmail } = useAuthStore();
	const [open1, setOpen1] = useState<boolean>(false);
	const [open2, setOpen2] = useState<boolean>(false);
	const [modalPic, setModalPic] = useState<string>(user?.avatar || "");
	const [otp, setOtp] = useState<string>("");

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
		setOpen1(false);
	}

	async function handleVerifyEmail() {
		if (otp.trim() !== "" && otp.length === 4) {
			const res = await verifyEmail({ otp });
			if (res == "verified") {
				setOpen2(false);
			}
		} else {
			toast.error("Invalid OTP", { className: "toast" });
		}
		setOpen2(false)
	}

	useEffect(() => {
		if (!user?.isVerified) {
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
	}, []);

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
			{/* profile-change modal */}
			<Modal openModal={open1}>
				<div
					className={clsx(
						"max-w-3xl min-w-md p-4 rounded-2xl flex flex-col gap-2",
						isDark ? "bg-zinc-700" : "bg-zinc-300"
					)}
				>
					<span className="flex justify-between items-center">
						<H4>Change Profile Picture</H4>
						<Button onClick={() => setOpen1(false)}>X</Button>
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
			</Modal>
			{/* otp modal */}
			<Modal openModal={open2}>
				<div
					className={clsx(
						"max-w-3xl min-w-md p-4 rounded-2xl flex flex-col gap-2 items-center",
						isDark ? "bg-zinc-700" : "bg-zinc-300"
					)}
				>
					<span className="flex justify-between items-center w-full">
						<H4>Verify Email</H4>
						<Button onClick={() => setOpen2(false)}>X</Button>
					</span>
					<InputOTP
						maxLength={4}
						value={otp}
						onChange={(value) => setOtp(value)}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
						</InputOTPGroup>
					</InputOTP>
					<Button
						type="button"
						onClick={handleVerifyEmail}
						disabled={isVerifingEmail}
					>
						Submit
					</Button>
				</div>
			</Modal>
		</div>
	);
}

export default Profile;
