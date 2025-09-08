import Modal from "./Modal";
import Button from "./ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import { toast } from "react-toastify";
import { useState } from "react";
import { Close } from "@/assets/icons/Close";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Eye, EyeClosed } from "@/assets/icons/authenticatepage";
import useUpdatePassword from "@/hooks/useUpdatePassword";

interface ChangePasswordProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function ChangePasswordModal({ open, setOpen }: ChangePasswordProps) {
	const { updatePasswordFn: changePassword, isPending: isChangingPassword } =
		useUpdatePassword();
	// const { changePassword, isChangingPassword } = useAuthStore();
	const [form, setForm] = useState<{
		password: string;
		confirmPassword: string;
	}>({
		password: "",
		confirmPassword: "",
	});
	const [valid, setValid] = useState<{
		password: boolean;
		confirmPassword: boolean;
	}>({
		password: true,
		confirmPassword: true,
	});
	const [visi, setVisi] = useState<boolean>(false);

	const validatePassword = (password: string) => {
		if (password.trim().length >= 8) setValid({ ...valid, password: true });
		else setValid({ ...valid, password: false });
	};

	const validateConfirmPassword = (password: string) => {
		if (password.trim() === form.password.trim())
			setValid({ ...valid, confirmPassword: true });
		else setValid({ ...valid, confirmPassword: false });
	};

	function handleSubmit() {
		if (
			form.password != "" &&
			form.password.length >= 8 &&
			form.confirmPassword === form.password
		) {
			changePassword(form);
			setOpen(false);
		} else {
			toast.error("All fields are required", { className: "toast" });
		}
	}
	return (
		<Modal openModal={open}>
			<Card className="min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Change Password</CardTitle>
					<Button onClick={() => setOpen(false)}>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<Label
						title="New Password field is required"
						htmlFor="newpassword"
						className="grid"
					>
						New Password *
						<div className="flex items-center justify-between w-full gap-1">
							<Input
								placeholder="Enter Your Password"
								type={visi ? "text" : "password"}
								value={form.password}
								name="newpassword"
								required
								onChange={(e) => {
									setForm({
										...form,
										password: e.target.value.trim(),
									});
									if (e.target.value.trim() != "") {
										validatePassword(e.target.value.trim());
									} else {
										setValid({ ...valid, password: true });
									}
								}}
							/>
							<Button
								onClick={() => setVisi(!visi)}
								type="button"
								variant="ghost"
							>
								{visi ? <Eye /> : <EyeClosed />}
							</Button>
						</div>
						{!valid.password && (
							<span className="text-xs text-red-500">
								*Password must be atleast 8 character
							</span>
						)}
					</Label>
					<Label
						title="Confirm Password field is required"
						htmlFor="confirmPassword"
						className="grid"
					>
						Confirm Password *
						<div className="flex items-center justify-between w-full gap-1">
							<Input
								placeholder="Re-enter Your Password"
								type={visi ? "text" : "password"}
								value={form.confirmPassword}
								name="confirmPassword"
								required
								onChange={(e) => {
									setForm({
										...form,
										confirmPassword: e.target.value.trim(),
									});
									if (e.target.value.trim() != "") {
										validateConfirmPassword(
											e.target.value.trim()
										);
									} else {
										setValid({
											...valid,
											confirmPassword: true,
										});
									}
								}}
							/>
							<Button
								onClick={() => setVisi(!visi)}
								type="button"
								variant="ghost"
							>
								{visi ? <Eye /> : <EyeClosed />}
							</Button>
						</div>
						{!valid.confirmPassword && (
							<span className="text-xs text-red-500">
								*Password must same as above
							</span>
						)}
					</Label>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						type="button"
						onClick={handleSubmit}
						disabled={isChangingPassword}
					>
						Submit
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default ChangePasswordModal;
