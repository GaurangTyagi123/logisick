import { Close } from "@/assets/icons/Close";
import BarcodeScan from "@/components/BarcodeScan";
import Modal from "@/components/Modal";
import Button from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Dispatch, SetStateAction } from "react";

interface BarcodeScannerModalProps {
	open: boolean;
	setOpen: Dispatch<SetStateAction<boolean>>;
	setForm: Dispatch<
		SetStateAction<{
			name: string;
			organizationId: string;
			costPrice: number;
			sellingPrice: number;
			quantity: number;
			inventoryCategory: string;
			importance: "A" | "B" | "C";
			importedOn: Date;
			expiresOn?: Date;
			weight?: number;
			colour?: string;
			reorderLevel?: number;
			batchNumber?: number;
			origin?: string;
		}>
	>;
}

function BarcodeScannerModal({
	setForm,
	open,
	setOpen,
}: BarcodeScannerModalProps) {
	return (
		<Modal openModal={open}>
			<Card className="w-11/12 sm:max-w-sm">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Scan Item Barcode</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2 max-h-80 overflow-auto">
					<BarcodeScan setForm={setForm} setOpen={setOpen} />
				</CardContent>
				<CardFooter className="flex gap-2">
					<Button
						type="button"
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						Cancel
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default BarcodeScannerModal;
