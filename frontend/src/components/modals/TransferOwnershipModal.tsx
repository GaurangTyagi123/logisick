import Modal from "../Modal";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../ui/card";
import Button from "../ui/button";
import { Close } from "@/assets/icons/Close";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferOwnership } from "@/services/apiOrg";
import { toast } from "react-toastify";
import useGetEmployees from "@/hooks/useGetEmployees";
type OrganizationFormData = {
	employee: string;
};

function TransferOwnershipModal({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { handleSubmit, control } = useForm<OrganizationFormData>();
	const queryClient = useQueryClient();
	const userData = queryClient.getQueryData<{ user: User }>(["user"]);
	const user = userData?.user;
	const org = user?.myOrg;
	const { data: employees, isPending: isFetching } = useGetEmployees(
		org?._id as string
	);

	const { mutate: transferOwnershipFn, isPending } = useMutation({
		mutationFn: transferOwnership,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user"],
			});
			toast.success("Ownership transferred successfully", {
				className: "toast",
			});
		},
		onError: (err) => {
			toast.error(err.message);
		},
	});

	const onSubmit = (data: OrganizationFormData) => {
		if (org?._id) transferOwnershipFn({ ...data });
		setOpen(false);
	};
	return (
		<Modal openModal={open}>
			<Card className="min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Transfer Ownership To</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2">
					<form>
						<Label
							title="Previous Password field is required"
							htmlFor="Type"
							className="grid gap-4 mt-3"
						>
							Employees
							<div className="flex items-center justify-between w-full gap-1">
								<Controller
									name="employee"
									control={control}
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue
													placeholder={user?.name}
													defaultValue={user?._id}
												/>
											</SelectTrigger>
											<SelectContent>
												{(employees || isFetching) &&
													employees?.map(
														(emp: User) =>
															emp._id !==
																user?._id && (
																<SelectItem
																	value={
																		emp._id
																	}
																	key={
																		emp._id
																	}
																>
																	{emp.name}
																</SelectItem>
															)
													)}
											</SelectContent>
										</Select>
									)}
								/>
							</div>
						</Label>
					</form>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						type="submit"
						onClick={handleSubmit(onSubmit)}
						disabled={isPending}
					>
						Submit
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default TransferOwnershipModal;
