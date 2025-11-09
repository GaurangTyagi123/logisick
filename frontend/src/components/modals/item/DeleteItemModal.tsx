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
import { useNavigate } from "react-router-dom";

interface DeleteItemModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	itemData: Item;
	deleteItem: UseMutateFunction<any, Error, string, unknown>;
	isPending: boolean;
}

function DeleteItemModal({
	open,
	setOpen,
	itemData,
	deleteItem,
	isPending,
}: DeleteItemModalProps) {
	const [text, setText] = useState<string>("");
    const navigate = useNavigate();

	return (
		<Modal openModal={open}>
			<Card>
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Remove Item</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-4">
					<Small>Item's Name : {itemData.name}</Small>
					<Small>Item's SKU : {itemData.SKU?.substring(25)}</Small>
					<Label
						title="remove item"
						htmlFor="removeitem"
						className="grid"
					>
						<span>
							Enter "
							<span className="text-red-500">
								remove {itemData.name}
							</span>
							" in the input below to remove item
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
							deleteItem(itemData._id);
							setText("");
							setOpen(false);
                            navigate(-1);
						}}
						disabled={
							isPending ||
							text.trim() !== `remove ${itemData.name}`
						}
						variant={"destructive"}
					>
						Remove Item
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default DeleteItemModal;
