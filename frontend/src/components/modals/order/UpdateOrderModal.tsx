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
import useGetItemById from "@/hooks/item/useGetItemById";
import useUpdateOrder from "@/hooks/order/useUpdateOrder";
import { useState } from "react";
import { toast } from "react-toastify";

interface UpdateOrderModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	orderData: {
		_id: string;
		itemId: string;
		orderName?: string;
		quantity: number;
		shipped: boolean;
		orderedOn: Date;
	};
}
function UpdateOrderModal({ open, setOpen, orderData }: UpdateOrderModalProps) {
	const { isUpdatingOrder, updateOrderFn } = useUpdateOrder();
	const [orderUpdated, _setOrderUpdated] = useState({
		quantity: orderData.quantity,
		shipped: orderData.shipped,
		orderedOn: orderData.orderedOn,
	});
	const { isGettingItem, item } = useGetItemById(orderData.itemId);

	const handleUpdateOrder = () => {
		if (item?.quantity && item?.quantity < orderUpdated.quantity) {
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
				<CardContent className="grid gap-2 max-h-80 overflow-auto ms:px-1">
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
						disabled={isUpdatingOrder || isGettingItem}
						variant={"destructive"}
					>
						Update Order
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default UpdateOrderModal;
