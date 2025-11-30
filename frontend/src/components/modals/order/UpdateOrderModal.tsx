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
import type { UseMutateFunction } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface UpdateOrderModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orderData: shipmentType;
	isUpdatingOrder: boolean;
	updateOrderFn: UseMutateFunction<
		void | shipmentType,
		any,
		{
			orderId: string;
			orderUpdated: {
				quantity?: number;
				shipped?: boolean;
				orderedOn?: Date;
			};
		},
		unknown
	>;
}

/**
 * @component modal to update order
 * @param {boolean} open condition to maintain modal open state
 * @param {Function} setOpen function to change modal open state
 * @param {orderdata} orderdata order data
 * @param {Function} updateOrderFn function to update order 
 * @param {boolean} isUpdatingOrder pending state of updating order request
 * @author `Ravish Ranjan`
 */
function UpdateOrderModal({
	open,
	setOpen,
	orderData,
	updateOrderFn,
	isUpdatingOrder,
}: UpdateOrderModalProps) {
	const [orderUpdated, setOrderUpdated] = useState({
		quantity: orderData.quantity,
		shipped: orderData.shipped,
		orderedOn: orderData.orderedOn,
	});

	/**
	 * @brief function to handle update of order on submit
	 */
	const handleUpdateOrder = () => {
		console.log("onsubmit order data : ", orderData);
		console.log("onsubmit update data: ", orderUpdated);
		if (
			orderUpdated.quantity < 0 ||
			orderUpdated.quantity > orderData.item.quantity
		) {
			return toast.error(
				"Order quantity can't be out of item's amount range",
				{ className: "toast" }
			);
		}
		updateOrderFn({
			orderId: orderData._id,
			orderUpdated: {
				orderedOn: orderUpdated.orderedOn,
				quantity: orderUpdated.quantity,
				shipped: orderUpdated.shipped,
			},
		});
	};

	// use effect to fill default value on component render
	useEffect(() => {
		if (open) {
			setOrderUpdated({
				quantity: orderData.quantity,
				shipped: orderData.shipped,
				orderedOn: orderData.orderedOn,
			});
		}
	}, [open, orderData.quantity, orderData.shipped, orderData.orderedOn]);

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>
						Update order{" "}
						{orderData.orderName ? orderData.orderName : "Order"}
					</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2 max-h-80 overflow-auto sm:px-1">
					<Label htmlFor="quantity" className="grid">
						<span>Quantity</span>
						<Input
							id="quantity"
							name="quantity"
							type="number"
							onFocus={(e) => e.target.select()}
							value={orderUpdated.quantity}
							className="text-sm md:text-md"
							min={1}
							max={orderData.item.quantity}
							onChange={(e) =>
								setOrderUpdated({
									...orderUpdated,
									quantity: Number(e.target.value),
								})
							}
							placeholder="Update item quantity"
							required
						/>
					</Label>
					<Label htmlFor="Ordered On" className="grid">
						<span>Ordered On</span>
						<Input
							id="orderedon"
							name="orderedOn"
							type="date"
							value={
								new Date(orderUpdated.orderedOn)
									.toISOString()
									.split("T")[0]
							}
							max={new Date().toISOString().split("T")[0]}
							onChange={(e) => {
								setOrderUpdated({
									...orderUpdated,
									orderedOn: new Date(
										e.target.valueAsDate ||
											orderUpdated.orderedOn
									),
								});
							}}
							placeholder="Enter item's order date"
							className="w-full text-sm md:text-md"
							required
						/>
					</Label>
					<Label htmlFor="isshipped" className="grid">
						<span>Is Shipped</span>
						<div className="grid grid-cols-1 sm:grid-cols-2">
							<Button
								variant={
									orderUpdated.shipped
										? "outline"
										: "secondary"
								}
								onClick={() =>
									setOrderUpdated({
										...orderUpdated,
										shipped: false,
									})
								}
								className="sm:rounded-r-none"
							>
								Under Process
							</Button>
							<Button
								variant={
									orderUpdated.shipped
										? "secondary"
										: "outline"
								}
								onClick={() =>
									setOrderUpdated({
										...orderUpdated,
										shipped: true,
									})
								}
								className="sm:rounded-l-none"
							>
								Shipped
							</Button>
						</div>
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
							handleUpdateOrder();
							setOpen(false);
						}}
						disabled={isUpdatingOrder}
					>
						Update Order
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default UpdateOrderModal;
