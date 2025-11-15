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
import { toast } from "react-toastify";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import type { UseMutateFunction } from "@tanstack/react-query";

interface ChangeEmpRole {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orgid: string;
	empData: {
		_id: string;
		name: string;
		email: string;
	};
	oldRole: "Admin" | "Manager" | "Staff";
	changeRole: UseMutateFunction<
		void | Emp,
		any,
		{
			orgid: string;
			newRole: "Admin" | "Manager" | "Staff";
			userid: string;
		},
		unknown
	>;
	isPending: boolean;
}

function ChangeEmpRoleModal({
	open,
	setOpen,
	empData,
	orgid,
	oldRole,
	changeRole,
	isPending,
}: ChangeEmpRole) {
	const [role, setRole] = useState<"Admin" | "Manager" | "Staff">(oldRole);

	const handleChangeRole = () => {
		if (role) {
			changeRole({
				orgid,
				newRole: role,
				userid: empData._id,
			});
		} else {
			toast.error("Select role first", { className: "toast" });
		}
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
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant={"outline"}>{role} v</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{["Admin", "Manager", "Staff"]
								.filter((value) => value != oldRole)
								.map((roles, i) => {
									return (
										<DropdownMenuItem
											asChild
											key={`${i}-role`}
										>
											<Button
												variant={"outline"}
												className="w-full"
												onClick={() =>
													setRole(
														roles as
															| "Admin"
															| "Manager"
															| "Staff"
													)
												}
											>
												{roles}
											</Button>
										</DropdownMenuItem>
									);
								})}
						</DropdownMenuContent>
					</DropdownMenu>
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
						Change Role
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default ChangeEmpRoleModal;
