import { useState } from "react";
import Modal from "@/components/Modal";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import useAuthStore from "@/stores/useAuthStore";
import Button from "@/components/ui/button";
import { Close } from "@/assets/icons/Close";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/**
 * @component a modal for profilepage which prompts user to delete account when clicks to do so
 * @param {boolean} open a boolean value stating is modal is open
 * @param {Function} setOpen a function to change state of open of modal
 * @author `Ravish Ranjan`
 */
function DeleteMeModal({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [text, setText] = useState<string>("");
	const { deleteUser, isDeleteingUser } = useAuthStore();

	/**
	 * @brief async function to handle the user request to delete account
	 */
	async function handleDeleteAccount() {
		if (text.trim() == "delete my account") {
			await deleteUser();
			setOpen(false);
		} else {
			toast.error("Enter the text first", { className: "toast" });
		}
	}

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Delete My Account</CardTitle>
					<Button onClick={() => setOpen(false)} variant={"secondary"}>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<Label
						title="delete my account"
						htmlFor="deleteme"
						className="grid text-balance"
					>
						<span>
							Enter "
							<span className="text-red-500">
								delete my account
							</span>
							" in the input below to delete account
						</span>
						<Input
							placeholder="Enter Text"
							type="email"
							value={text}
							name="text"
							required
							className="text-sm md:text-md"
							onChange={(e) => setText(e.target.value.trim())}
						/>
					</Label>
				</CardContent>
				<CardFooter className="flex gap-2">
					<Button onClick={() => setOpen(false)} variant={"secondary"}>Cancel</Button>
					<Button
						type="button"
						onClick={handleDeleteAccount}
						disabled={
							isDeleteingUser ||
							text.trim() !== "delete my account"
						}
						variant={"destructive"}
					>
						Delete My Account
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default DeleteMeModal;
