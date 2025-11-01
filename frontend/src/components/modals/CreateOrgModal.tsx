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
import { Input } from "../ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createOrg } from "@/services/apiOrg";
import { toast } from "react-toastify";
const orgTypes = ["Basic", "Small-Cap", "Mid-Cap", "Large-Cap", "Other"];
type OrganizationFormData = {
	name: string;
	description?: string;
	type?: string;
};
/**
 * @component a modal for profilepage which prompts user to create their own organization when clicks to do so
 * @param open a boolean value stating is modal is open
 * @param setOpen a function to change state of open of modal
 * @returns gives a components as a create organization modal to put somewhere
 */
function OrganizationModal({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { register, handleSubmit, formState, control, reset } =
		useForm<OrganizationFormData>();
	const { errors } = formState;
	const queryClient = useQueryClient();
	const { mutate: createOrgFn, isPending } = useMutation({
		mutationFn: createOrg,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["orgs"],
			});
			toast.success("Organization created successfully", {
				className: "toast",
			});
		},
		onError: (err) => {
			toast.error(err.message);
		},
		onSettled: () => {
			reset();
		},
	});

	const onSubmit = (data: OrganizationFormData) => {
		createOrgFn(data);
		setOpen(false);
	};
	return (
		<Modal openModal={open}>
			<Card className="min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Create Organization</CardTitle>
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
							htmlFor="name"
							className="grid gap-4 my-3"
						>
							Organization's Name
							<div className="flex items-center justify-between w-full gap-1">
								<Input
									placeholder="Enter Your Organization's Name"
									type="text"
									id="name"
									{...register("name", {
										required: "Please provide a name",
										minLength: {
											value: 1,
											message: "Name is too short",
										},
										maxLength: {
											value: 48,
											message: "Name is too long",
										},
									})}
								/>
							</div>
							{errors?.name && (
								<span className="text-xs text-red-500">
									{errors?.name?.message as string}
								</span>
							)}
						</Label>
						<Label
							title="Previous Password field is required"
							htmlFor="Description"
							className="grid gap-4"
						>
							Organization's Description
							<div className="flex items-center justify-between w-full gap-1">
								<Input
									placeholder="Enter a brief description "
									type="text"
									id="Description"
									{...register("description", {
										required:
											"Please provide a description of your organization",
										minLength: {
											value: 8,
											message: "Description is too short",
										},
										maxLength: {
											value: 300,
											message: "Description is too long",
										},
									})}
								/>
							</div>
							{errors?.description && (
								<span className="text-xs text-red-500">
									{errors?.description?.message as string}
								</span>
							)}
						</Label>
						<Label
							title="Previous Password field is required"
							htmlFor="Type"
							className="grid gap-4 mt-3 w-full"
						>
							Type
							<div className="flex items-center justify-between w-full gap-1">
								<Controller
									name="type"
									control={control}
									render={({ field }) => (
										<Select
											onValueChange={field.onChange}
											value={field.value}
										>
											<SelectTrigger className="w-full">
												<SelectValue
													placeholder="Basic"
													defaultValue="Basic"
												/>
											</SelectTrigger>
											<SelectContent>
												{orgTypes.map((type, index) => (
													<SelectItem
														value={type}
														key={index}
													>
														{type}
													</SelectItem>
												))}
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

export default OrganizationModal;
