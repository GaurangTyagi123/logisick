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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { transferOwnership } from "@/services/apiOrg";
import { toast } from "react-toastify";
import { Input } from "../ui/input";
type OrganizationFormData = {
	newOwnerEmail: string;
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
			toast.error(err.message, { className: "toast" });
		},
	});

	const onSubmit = (data: OrganizationFormData) => {
		transferOwnershipFn({ ...data });
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
							title="transfer ownership"
							htmlFor="transferownership"
							className="grid"
						>
							<span>New owner's email id</span>
							<Controller
								name="newOwnerEmail"
								control={control}
								render={({ field }) => (
									<Input
										placeholder="Enter new owner's email id"
										type="email"
										value={field.value}
										name="newOwnerEmail"
										required
										className="text-sm md:text-md"
										onChange={field.onChange}
									/>
								)}
							/>
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
