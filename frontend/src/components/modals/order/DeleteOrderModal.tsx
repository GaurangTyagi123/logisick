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
import { Small } from "@/components/ui/Typography";
import type { UseMutateFunction } from "@tanstack/react-query";
import { useState } from "react";

interface DeleteOrderModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orderData: {
		orderName?: string;
		_id: string;
	};
	deleteOrderFn: UseMutateFunction<void, Error, string, unknown>;
	isDeletingOrder: boolean;
}

/**
 * @component modal to delete order
 * @param {boolean} open condition to maintain modal open state
 * @param {Function} setOpen function to change modal open state
 * @param {orderdata} orderdata order data
 * @param {Function} deleteOrderFn function to delete order 
 * @param {boolean} isDeletingOrder pending state of deleting order request
 * @author `Ravish Ranjan`
 */
function DeleteOrderModal({
	open,
	setOpen,
	orderData,
	deleteOrderFn,
	isDeletingOrder,
}: DeleteOrderModalProps) {
	const [text, setText] = useState<string>("");

	return (
		<Modal openModal={open}>
			<Card className="w-md max-w-11/12">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Remove Order</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Small>Order's Name : {orderData.orderName}</Small>
					<Label
						title="remove order"
						htmlFor="removeorder"
						className="grid"
					>
						<span>
							Enter "
							<span className="text-red-500">
								remove {orderData.orderName}
							</span>
							" in the input below to remove order
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
							deleteOrderFn(orderData._id);
							setOpen(false);
							setText("");
						}}
						disabled={
							isDeletingOrder ||
							text.trim() !== `remove ${orderData.orderName}`
						}
						variant={"destructive"}
					>
						Remove Order
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default DeleteOrderModal;
