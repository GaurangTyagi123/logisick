import { Close } from "@/assets/icons/Close";
import Modal from "./Modal";
import Button from "./ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import UserAvatar from "./avatar";
import { Input } from "./ui/input";
import { Dice } from "@/assets/icons/profilepage";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/useAuthStore";

interface ChangeProps {
	open: boolean;
	setModalPic: React.Dispatch<React.SetStateAction<string>>;
	modalPic: string;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ProfilePicChangeModal({
	open,
	setModalPic,
	modalPic,
	setOpen,
}: ChangeProps) {
	const { user, updateUser, isUpdatingUser } = useAuthStore();

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
		if (modalPic.length > 0 && modalPic !== user?.avatar) {
			updateUser({ avatar: modalPic });
			setOpen(false);
		} else {
			toast.error("Changed avatar can't be same or empty", {
				className: "toast",
			});
		}
	}

	return (
		<Modal openModal={open}>
			<Card className="min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Change Profile Picture</CardTitle>
					<Button onClick={() => setOpen(false)} variant={"ghost"}>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="flex flex-col gap-2 items-center">
					<UserAvatar customSeed={modalPic} className="w-40 h-40" />
					<div className="flex gap-2 w-full">
						<Input
							type="text"
							autoFocus
							value={modalPic}
							className="text-lg font-semibold text-center bg-accent"
							onChange={(e) => setModalPic(e.target.value.trim())}
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
				</CardContent>
				<CardFooter>
					<Button
						className="front-semibold w-full"
						onClick={handleProfilePicChange}
						disabled={isUpdatingUser}
					>
						Seems Good!
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default ProfilePicChangeModal;
