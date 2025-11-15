import Modal from "@/components/Modal";
import Button from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { toast } from "react-toastify";
import { useState } from "react";
import { Close } from "@/assets/icons/Close";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import useUpdateUser from "@/hooks/user/useUpdateUser";

interface ChangePasswordProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * @component a modal for profilepage which prompts user for update user details when clicks to change password
 * @param open a boolean value stating is modal is open
 * @param setOpen a function to change state of open of modal
 * @returns gives a components as a change password modal to put somewhere
 */
function UpdateUserModal({ open, setOpen }: ChangePasswordProps) {
	const { updateUserFn: updateUser, isPending: isUpdatingUser } =
		useUpdateUser();

	const [form, setForm] = useState<{
		name: string;
		email: string;
	}>({
		name: "",
		email: "",
	});
	const [valid, setValid] = useState<{
		email: boolean;
	}>({
		email: true,
	});

	/**
	 * @brief function to validate email field
	 * @param password string value to check for constrains of email
	 */
	function validateEmail(email: string) {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		setValid({ ...valid, email: emailRegex.test(email) });
	}

	/**
	 * @brief function to handle the submittion of change password form
	 */
	function handleSubmit() {
		if (form.name.trim() == "" && form.email.trim() == "")
			toast.error("Atleast one field is required", {
				className: "toast",
			});
		const submitForm: { name?: string; email?: string } = {};

		if (form.email.trim() !== "" && valid.email)
			submitForm.email = form.email.trim();

		if (form.name.trim() !== "") submitForm.name = form.name.trim();
		updateUser(submitForm);
		setForm({ name: "", email: "" });
	}

	return (
		<Modal openModal={open}>
			<Card className="min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Update User</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<Label
						title="Full Name field is required"
						htmlFor="name"
						className="grid"
					>
						Full Name
						<Input
							placeholder="Enter Your Full Name"
							type="text"
							value={form.name}
							name="name"
							required
							className="text-sm md:text-md"
							onChange={(e) => {
								setForm({
									...form,
									name: e.target.value,
								});
							}}
						/>
					</Label>
					<Label
						title="Email field is required"
						htmlFor="email"
						className="grid"
					>
						Email
						<Input
							placeholder="Enter Your Email"
							type="email"
							value={form.email}
							name="email"
							required
							className="text-sm md:text-md"
							onChange={(e) => {
								setForm({
									...form,
									email: e.target.value.trim(),
								});
								if (e.target.value.trim() != "") {
									validateEmail(e.target.value.trim());
								} else {
									setValid({ ...valid, email: true });
								}
							}}
						/>
						{!valid.email && (
							<span className="text-xs text-red-500">
								*Not a valid Email
							</span>
						)}
					</Label>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						type="submit"
						onClick={handleSubmit}
						disabled={isUpdatingUser}
					>
						Update User
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default UpdateUserModal;
