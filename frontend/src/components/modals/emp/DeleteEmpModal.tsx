import { Close } from "@/assets/icons/Close";
import Modal from "@/components/Modal";
import Button from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import type { UseMutateFunction } from "@tanstack/react-query";
import { Small } from "@/components/ui/Typography";

interface DeleteEmpProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	empData: {
		_id: string;
		name: string;
		email: string;
	};
	orgid: string;
	deleteEmp: UseMutateFunction<
		void,
		any,
		{
			userid: string;
			orgid: string;
		},
		unknown
	>;
	isPending: boolean;
}

function DeleteEmpModal({
	open,
	setOpen,
	empData,
	orgid,
	deleteEmp,
	isPending,
}: DeleteEmpProps) {
	const [text, setText] = useState<string>("");

	return (
		<Modal openModal={open}>
			<Card className="max-w-screen">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Remove Employee {empData.name}</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<Small>Employee Email : {empData.email}</Small>
					<Label
						title="remove employee"
						htmlFor="removeemp"
						className="grid"
					>
						<span>
							Enter "
							<span className="text-red-500">
								remove {empData.name}
							</span>
							" in the input below to remove employee
						</span>
						<Input
							placeholder="Enter Text"
							type="text"
							value={text}
							name="name"
							required
							className="text-sm md:text-md"
							onChange={(e) => setText(e.target.value)}
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
							deleteEmp({ userid: empData._id, orgid: orgid });
							setText("");
							setOpen(false);
						}}
						disabled={
							isPending ||
							text.trim() !== `remove ${empData.name}`
						}
						variant={"destructive"}
					>
						Remove Employee
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default DeleteEmpModal;
