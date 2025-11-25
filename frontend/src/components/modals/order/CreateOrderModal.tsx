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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useCreateOrder from "@/hooks/order/useCreateOrder";
import { getOrganization } from "@/services/apiOrg";
import { useQuery, type UseMutateFunction } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface CreateOrderModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orderdata: {
		itemId: string;
		itemName: string;
		itemAmount: number;
	};
	isCreatingOrder: boolean;
	createOrderFn: UseMutateFunction<
		void | shipmentType,
		Error,
		{
			itemId: string;
			quantity: number;
			organizationId: string;
			orderedOn: Date;
		},
		unknown
	>;
}

function CreateOrderModal({ open, setOpen, orderdata }: CreateOrderModalProps) {
	const { createOrderFn, isCreatingOrder } = useCreateOrder();
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	console.log("Order Data", orderdata);
	const [form, setForm] = useState<{
		quantity: number;
		orderedOn: Date;
	}>({
		quantity: 1,
		orderedOn: new Date(),
	});

	const handleCreateOrder = () => {
		console.log("form on submit", form);
		if (form.quantity < 0 || form.quantity > orderdata.itemAmount) {
			return toast.error(
				"Order quantity can't be out of item's amount range",
				{ className: "toast" }
			);
		}
		if (form.orderedOn > new Date()) {
			return toast.error("Can't place order in future", {
				className: "toast",
			});
		}
		if (orgData?._id.trim() === "") {
			return toast.error("Organization can't be identified", {
				className: "toast",
			});
		}
		if (orderdata.itemId.trim() === "") {
			return toast.error("Item can't be identified", {
				className: "toast",
			});
		}
		console.log("comming here");
		createOrderFn({
			...form,
			organizationId: orgData?._id,
			itemId: orderdata.itemId,
		});
		setForm({
			orderedOn: new Date(),
			quantity: 1,
		});
		setOpen(false);
	};

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>
						Create new order for {orderdata.itemName}
					</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2 max-h-80 overflow-auto ms:px-1">
					<Label htmlFor="quantity" className="grid">
						<span>Quantity *</span>
						<Input
							id="quantity"
							name="quantity"
							type="number"
							onFocus={(e) => e.target.select()}
							value={form.quantity}
							className="text-sm md:text-md"
							min={1}
							max={orderdata.itemAmount}
							onChange={(e) =>
								setForm({
									...form,
									quantity: Number(e.target.value),
								})
							}
							placeholder="Enter item quantity"
							required
						/>
					</Label>
					<Label htmlFor="importedon" className="grid">
						<span>Imported On *</span>
						<Input
							id="importedon"
							name="importedOn"
							type="date"
							value={form.orderedOn.toISOString().split("T")[0]}
							max={form.orderedOn.toISOString().split("T")[0]}
							onChange={(e) => {
								setForm({
									...form,
									orderedOn: new Date(
										e.target.valueAsDate || form.orderedOn
									),
								});
							}}
							placeholder="Enter item's imported date"
							className="w-full text-sm md:text-md"
							required
						/>
					</Label>
				</CardContent>
				<CardFooter className="flex gap-2">
					<Button
						type="button"
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						Cancel
					</Button>
					<Button
						type="button"
						onClick={handleCreateOrder}
						disabled={isCreatingOrder || isGettingOrg}
					>
						Create Order
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default CreateOrderModal;
