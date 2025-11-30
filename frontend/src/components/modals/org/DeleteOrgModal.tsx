import { useState } from "react";
import Modal from "@/components/Modal";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Close } from "@/assets/icons/Close";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteOrg } from "@/services/apiOrg";

/**
 * @component a modal for profilepage which prompts user to delete organization when clicked to do so
 * @param {boolean} open a boolean value stating is modal is open
 * @param {Function} setOpen a function to change state of open of modal
 * @author `Gaurang Tyagi`
 */
function DeleteOrgModal({
	open,
	setOpen,
	orgId,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orgId: string | undefined;
}) {
	const [text, setText] = useState<string>("");
	const queryClient = useQueryClient();
	const { mutate: deleteOrgFn, isPending: isDeleting } = useMutation({
		mutationFn: deleteOrg,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user"],
			});
			queryClient.invalidateQueries({
				queryKey: ["orgs"],
			});
			toast.success("Organization deleted successfully", {
				className: "toast",
			});
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});

	/**
	 * @brief async function to handle the user request to delete account
	 */
	async function handleDeleteAccount() {
		console.log("Org id",orgId)
		if (text.trim() == "delete my organization" && orgId) {
			deleteOrgFn(orgId);
			setOpen(false);
		} else {
			toast.error("Enter the text first", { className: "toast" });
		}
	}

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Delete My Organization</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<Label
						title="delete my account"
						htmlFor="deleteme"
						className="grid"
					>
						<span>
							Enter "
							<span className="text-red-500">
								delete my organization
							</span>
							" in the input below to delete organization
						</span>
						<Input
							placeholder="Enter Text"
							type="text"
							value={text}
							name="org text"
							required
							className="text-sm md:text-md"
							onChange={(e) => setText(e.target.value)}
						/>
					</Label>
				</CardContent>
				<CardFooter className="flex flex-wrap gap-2 w-full">
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleDeleteAccount}
						disabled={
							isDeleting ||
							text.trim() !== "delete my organization"
						}
						variant={"destructive"}
					>
						Delete My Organization
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default DeleteOrgModal;
