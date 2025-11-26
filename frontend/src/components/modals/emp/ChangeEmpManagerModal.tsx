import Modal from "@/components/Modal";
import Button from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Close } from "@/assets/icons/Close";
import { useState } from "react";
import type { UseMutateFunction } from "@tanstack/react-query";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

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

/**
 * @component modal to change manager of employee
 * @param {boolean} open condition to maintain modal open state
 * @param {Function} setOpen function to change modal open state
 * @param {Employee-Data} empDate employee data { _id:string, name:string, email:string }
 * @param {string} orgid organization id
 * @param {Function} changeManager change manager function
 * @param {boolean} isPending pending state for change manager function
 * @author `Ravish Ranjan`
 */
function ChangeEmpManagerModal({
	open,
	setOpen,
	empData,
	orgid,
	changeManager,
	isPending,
}: ChangeEmpRole) {
	const [managerEmail, setManagerEmail] = useState<string>("");

	/**
	 * @brief function to handle change of manager on submit
	 */
	const handleChangeManager = () => {
		changeManager({ orgid, managerEmail, userid: empData._id });
	};

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Change Manager of {empData.name}</CardTitle>
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
							handleChangeManager();
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
