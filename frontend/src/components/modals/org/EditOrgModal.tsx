import Modal from "@/components/Modal";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Close } from "@/assets/icons/Close";
import { useForm, Controller } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/Select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateOrg } from "@/services/apiOrg";
import { toast } from "react-toastify";
const orgTypes = ["Basic", "Small-Cap", "Mid-Cap", "Large-Cap", "Other"];
type OrganizationFormData = {
	name: string;
	description?: string;
	type?: string;
};
/**
 * @component a modal for profilepage which prompts user to change organization details when clicks to do so
 * @param open a boolean value stating is modal is open
 * @param setOpen a function to change state of open of modal
 * @returns gives a components as a update organization modal to put somewhere
 */
function EditOrgModal({
	open,
	setOpen,
}: {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const queryClient = useQueryClient();
	const userObj = queryClient.getQueryData<{ user: User }>(["user"]);
	const organization = userObj?.user.myOrg;
	const { register, formState, handleSubmit, control } =
		useForm<OrganizationFormData>({
			defaultValues: organization,
		});
	const { errors } = formState;
	const { mutate: updateOrgFn, isPending: isUpdating } = useMutation({
		mutationFn: updateOrg,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: ["user"],
			});
			queryClient.invalidateQueries({
				queryKey: ["orgs"],
			});
			toast.success("Organization updated successfully", {
				className: "toast",
			});
		},
		onError: (err) => {
			toast.error(err.message, { className: "toast" });
		},
	});

	const onSubmit = (data: OrganizationFormData) => {
		if (organization) updateOrgFn({ id: organization?._id, data });
		setOpen(false);
	};
	return (
		<Modal openModal={open}>
			<Card className="w-11/12 sm:max-w-sm">
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
									className="text-sm md:text-md"
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
									className="text-sm md:text-md"
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
							className="grid gap-4 mt-3"
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
						disabled={isUpdating}
					>
						Submit
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default EditOrgModal;
