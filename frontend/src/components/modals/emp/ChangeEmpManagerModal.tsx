import Modal from "../../Modal";
import Button from "../../ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../ui/card";
import { Close } from "@/assets/icons/Close";
import { useState } from "react";
import type { UseMutateFunction } from "@tanstack/react-query";
import { Label } from "../../ui/label";
import { Input } from "../../ui/input";

interface ChangeEmpRole {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orgid: string;
	empData: {
		_id: string;
		name: string;
		email: string;
	};
	changeManager: UseMutateFunction<
		void | Emp,
		any,
		{
			orgid: string;
			managerEmail: string;
			userid: string;
		},
		unknown
	>;
	isPending: boolean;
}

function ChangeEmpManagerModal({
	open,
	setOpen,
	empData,
	orgid,
	changeManager,
	isPending,
}: ChangeEmpRole) {
	const [managerEmail, setManagerEmail] = useState<string>("");
	const handleChangeRole = () => {
		changeManager({ orgid, managerEmail, userid: empData._id });
	};

	return (
		<Modal openModal={open}>
			<Card className="min-w-sm md:min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Change Role of {empData.name}</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<Label
						title="change emp Manager"
						htmlFor="changemanager"
						className="grid"
					>
						<span>Manager's email id</span>
						<Input
							placeholder="Enter manager's email id"
							type="email"
							value={managerEmail}
							name="managerEmail"
							required
							className="text-sm md:text-md"
							onChange={(e) => setManagerEmail(e.target.value)}
						/>
					</Label>
				</CardContent>
				<CardFooter className="flex gap-2">
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={() => {
							handleChangeRole();
							setOpen(false);
						}}
						disabled={isPending}
					>
						Change Manager
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default ChangeEmpManagerModal;
