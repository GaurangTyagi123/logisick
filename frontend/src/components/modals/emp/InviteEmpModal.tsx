import { useState } from "react";
import { toast } from "react-toastify";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Modal from "@/components/Modal";
import Button from "@/components/ui/button";
import { Close } from "@/assets/icons/Close";
import { Label } from "@radix-ui/react-dropdown-menu";
import { Input } from "@/components/ui/input";
import useSendInvite from "@/hooks/emp/useSendInvite";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function InviteEmpModal({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const [form, setForm] = useState<{
		empEmail: string;
		role: "Admin" | "Manager" | "Staff";
	}>({ empEmail: "", role: "Staff" });

	const { sendInvitation, isSendingInvite } = useSendInvite();

	/**
	 * @brief async function to handle the user request to send invite
	 */
	function handleSendInvite() {
		if (
			form.empEmail.trim() !== "" &&
			["Admin", "Manager", "Staff"].includes(form.role.trim())
		) {
			sendInvitation(form);
			setOpen(false);
			setForm({ empEmail: "", role: "Staff" });
		} else {
			toast.error("Enter the text first", { className: "toast" });
		}
	}

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Send Invite</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-3">
					<Label title="New Employee's Email" className="grid">
						<span>Employee's email</span>
						<Input
							placeholder="Enter new employee's email"
							type="email"
							value={form.empEmail}
							name="empEmail"
							required
							className="text-sm md:text-md"
							onChange={(e) =>
								setForm({
									...form,
									empEmail: e.target.value.trim(),
								})
							}
						/>
					</Label>
					<Label title="New Employee's role" className="grid">
						<span>Enter new employee's role</span>
						<RadioGroup
							defaultValue={form.role}
							className="flex"
							onValueChange={(e) =>
								setForm({
									...form,
									role: e as "Admin" | "Manager" | "Staff",
								})
							}
						>
							<div className="flex items-center gap-3">
								<RadioGroupItem
									value="Staff"
									id="r1"
									className="text-ls-sec-500"
								/>
								<Label>Staff</Label>
							</div>

							<div className="flex items-center gap-3">
								<RadioGroupItem
									value="Manager"
									id="r2"
									className="text-ls-sec-500"
								/>
								<Label>Manager</Label>
							</div>

							<div className="flex items-center gap-3">
								<RadioGroupItem
									value="Admin"
									id="r3"
									className="text-ls-sec-500"
								/>
								<Label>Admin</Label>
							</div>
						</RadioGroup>
					</Label>
				</CardContent>
				<CardFooter className="flex gap-2">
					<Button
						type="button"
						onClick={handleSendInvite}
						className="w-full"
						disabled={
							isSendingInvite ||
							form.empEmail.trim() == "" ||
							!["Admin", "Manager", "Staff"].includes(
								form.role.trim()
							)
						}
					>
						Send Invite
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}
export default InviteEmpModal;
