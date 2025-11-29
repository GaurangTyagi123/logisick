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

/**
 * @component modal to create new order
 * @param {boolean} open condition to maintain modal open state
 * @param {Function} setOpen function to change modal open state
 * @param {orderdata} orderdata order data
 * @param {Function} createOrderFn function to create new order 
 * @param {boolean} isCreatingOrder pending state of creating order request
 * @author `Ravish Ranjan`
 */
function CreateOrderModal({
	open,
	setOpen,
	orderdata,
	createOrderFn,
	isCreatingOrder,
}: CreateOrderModalProps) {
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	const [form, setForm] = useState<{
		orderName : string
		quantity: number;
		orderedOn: Date;
	}>({
		orderName : "",
		quantity: 1,
		orderedOn: new Date(),
	});

	/**
	 * @brief function to handle creating new order on submit
	 */
	const handleCreateOrder = () => {
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
		createOrderFn({
			...form,
			organizationId: orgData?._id,
			itemId: orderdata.itemId,
		});
		setForm({
			orderedOn: new Date(),
			quantity: 1,
			orderName : ""
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
				<CardContent className="grid gap-2 max-h-80 overflow-auto sm:px-1">
					<Label htmlFor="orderName" className="grid">
						<span>Order Name *</span>
						<Input
							id="orderName"
							name="orderName"
							type="text"
							value={form.orderName}
							className="text-sm md:text-md"
							min={1}
							onChange={(e) =>
								setForm({
									...form,
									orderName: e.target.value,
								})
							}
							placeholder="Enter order Name"
							required
						/>
					</Label>
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
					<Label htmlFor="Ordered On" className="grid">
						<span>Ordered On *</span>
						<Input
							id="orderedon"
							name="orderedOn"
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
							placeholder="Enter item's order date"
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
