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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useUpdateItem from "@/hooks/item/useUpdateItem";
import { useState } from "react";
import { toast } from "react-toastify";

interface UpdateItemModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	item: Item;
}

function weightInGrams(unit: "MG" | "G" | "KG", weight?: number) {
	if (!weight) return weight;
	switch (unit) {
		case "KG":
			return weight * 1000;
		case "MG":
			return weight / 1000;
		default:
			return weight;
	}
}

function UpdateItemModal({ open, setOpen, item }: UpdateItemModalProps) {
	const { isPending: isUpdatingItem, updateItemFn } = useUpdateItem();
	const [weightUnit, setWeightUnit] = useState<"MG" | "G" | "KG">("G");

	const [form, setForm] = useState<{
		name: string;
		costPrice: number;
		sellingPrice: number;
		quantify: number;
		inventoryCategory: string;
		importance: "A" | "B" | "C";
		importedOn: string;
		expiresOn?: string;
		weight?: number;
		colour?: string;
		reorderLevel?: number;
		origin?: string;
	}>({
		name: item.name,
		costPrice: item.costPrice,
		sellingPrice: item.sellingPrice,
		quantify: item.quantity,
		inventoryCategory: item.inventoryCategory,
		importance: (item.importance || "C") as "A" | "B" | "C",
		importedOn: new Date(item.importedOn).toISOString(),
		expiresOn: new Date(item.expiresOn).toISOString(),
		weight: item.weight,
		colour: item.colour,
		reorderLevel: item.reorderLevel,
		origin: item.origin,
	});

	const handleUpdateItem = () => {
		if (form.name.trim() === "")
			return toast.warning("Item should have a name", {
				className: "toast",
			});

		if (form.costPrice <= 0)
			return toast.warning("Cost price can't be 0", {
				className: "toast",
			});

		if (form.sellingPrice <= 0)
			return toast.warning("Selling price can't be 0", {
				className: "toast",
			});

		if (form.quantify <= 0)
			return toast.warning("Quantity can't be 0", { className: "toast" });

		if (form.inventoryCategory.trim() === "")
			return toast.warning("Category of item is required", {
				className: "toast",
			});

		if (!["A", "B", "C"].includes(form.importance.trim()))
			return toast.warning("Item importance is invalid", {
				className: "toast",
			});

		if (new Date(form.importedOn) > new Date())
			return toast.warning("Imported data can't be in future", {
				className: "toast",
			});

		if (form.weight && form.weight <= 0)
			return toast.warning("Item can't be weightless", {
				className: "toast",
			});
		const submitForm: {
			name: string;
			costPrice: number;
			sellingPrice: number;
			quantify: number;
			inventoryCategory: string;
			importance: "A" | "B" | "C";
			importedOn: string;
			expiresOn?: string;
			weight?: number;
			colour?: string;
			reorderLevel?: number;
			origin?: string;
		} = JSON.parse(JSON.stringify(form));
		submitForm.weight = weightInGrams(weightUnit, form.weight);
		submitForm.name = submitForm.name.trim();
		submitForm.inventoryCategory = submitForm.inventoryCategory.trim();
		submitForm.colour = submitForm.colour?.trim();
		submitForm.origin = submitForm.origin?.trim();
		updateItemFn({ itemId: item._id, newItem: submitForm });
		setOpen(false);
	};

	return (
		<Modal openModal={open}>
			<Card className="min-w-lg max-w-screen">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Update item</CardTitle>
					<Button
						onClick={() => setOpen(false)}
						variant={"secondary"}
					>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid gap-2 max-h-96 overflow-auto">
					<div className="grid gap-2 grid-cols-2">
						<Label htmlFor="name" className="grid">
							<span>Name</span>
							<Input
								id="name"
								name="name"
								type="text"
								value={form.name}
								onChange={(e) =>
									setForm({ ...form, name: e.target.value })
								}
								placeholder="Enter item's name"
							/>
						</Label>
						<Label htmlFor="inventory-category" className="grid">
							<span>Inventory Category</span>
							<Input
								id="inventory-category"
								name="inventoryCategory"
								type="text"
								value={form.inventoryCategory}
								onChange={(e) =>
									setForm({
										...form,
										inventoryCategory: e.target.value,
									})
								}
								placeholder="Enter item's inventory category"
							/>
						</Label>
					</div>
					{/* costs */}
					<div className="grid grid-cols-2 gap-2">
						<Label htmlFor="costprice" className="grid">
							<span>Cost Price</span>
							<Input
								id="costprice"
								name="costPrice"
								type="number"
								value={form.costPrice}
								min={0}
								onChange={(e) =>
									setForm({
										...form,
										costPrice: Number(e.target.value),
									})
								}
								placeholder="Enter item cost price"
								required
							/>
						</Label>
						<Label htmlFor="sellingprice" className="grid">
							<span>Selling Price</span>
							<Input
								id="sellingprice"
								name="sellingPrice"
								type="number"
								value={form.sellingPrice}
								onChange={(e) =>
									setForm({
										...form,
										sellingPrice: Number(e.target.value),
									})
								}
								placeholder="Enter item selling price"
								required
							/>
						</Label>
					</div>
					<div className="grid grid-cols-2 gap-2">
						<Label htmlFor="quantity" className="grid">
							<span>Quantity</span>
							<Input
								id="quantity"
								name="quantity"
								type="number"
								value={form.quantify}
								onChange={(e) =>
									setForm({
										...form,
										quantify: Number(e.target.value),
									})
								}
								placeholder="Enter item quantity"
								required
							/>
						</Label>
						{/* weight */}
						<div className="flex gap-2 items-end w-full">
							<Label htmlFor="weight" className="grid w-full">
								<span>Weight</span>
								<Input
									id="weight"
									name="weight"
									type="number"
									min={1}
									value={form.weight}
									onChange={(e) =>
										setForm({
											...form,
											weight: Number(e.target.value),
										})
									}
									placeholder="Enter item's weight"
								/>
							</Label>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant={"outline"}>
										{weightUnit}
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent>
									<DropdownMenuRadioGroup
										defaultValue={weightUnit}
										onValueChange={(value) =>
											setWeightUnit(
												value as "KG" | "MG" | "G"
											)
										}
									>
										{["KG", "G", "MG"].map((unit, i) => {
											return (
												<DropdownMenuRadioItem
													key={i}
													value={unit}
												>
													{unit}
												</DropdownMenuRadioItem>
											);
										})}
									</DropdownMenuRadioGroup>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
					</div>
					<Label htmlFor="importance" className="grid">
						<span>Importance</span>
						<div className="grid grid-cols-3 gap-1">
							<Button
								onClick={() =>
									setForm({ ...form, importance: "A" })
								}
								variant={
									form.importance === "A"
										? "secondary"
										: "outline"
								}
								className="rounded-e-none"
							>
								A
							</Button>
							<Button
								onClick={() =>
									setForm({ ...form, importance: "B" })
								}
								variant={
									form.importance === "B"
										? "secondary"
										: "outline"
								}
								className="rounded-s-none rounded-e-none"
							>
								B
							</Button>
							<Button
								onClick={() =>
									setForm({ ...form, importance: "C" })
								}
								variant={
									form.importance === "C"
										? "secondary"
										: "outline"
								}
								className="rounded-s-none"
							>
								C
							</Button>
						</div>
					</Label>
					{/* dates */}
					<div className="grid grid-cols-2 gap-2">
						<Label htmlFor="importedon" className="grid">
							<span>Imported On</span>
							<Input
								id="importedon"
								name="importedOn"
								type="date"
								value={
									new Date(form.importedOn)
										.toISOString()
										.split("T")[0]
								}
								max={
									form.expiresOn
										? new Date(form.expiresOn)
												.toISOString()
												.split("T")[0]
										: new Date().toISOString().split("T")[0]
								}
								onChange={(e) => {
									setForm({
										...form,
										importedOn: new Date(
											e.target.valueAsDate ||
												form.importedOn
										).toISOString(),
									});
								}}
								placeholder="Enter item's imported date"
								className="w-full"
								required
							/>
						</Label>
						<Label htmlFor="expireson" className="grid">
							<span>Expires On</span>
							<Input
								id="expireson"
								name="expiresOn"
								type="date"
								value={
									form.expiresOn
										? new Date(form.expiresOn)
												.toISOString()
												.split("T")[0]
										: new Date().toISOString().split("T")[0]
								}
								min={
									new Date(form.importedOn)
										.toISOString()
										.split("T")[0]
								}
								onChange={(e) => {
									setForm({
										...form,
										expiresOn: e.target.valueAsDate
											? new Date(
													e.target.valueAsDate
											  ).toISOString()
											: undefined,
									});
								}}
								placeholder="Enter item's expiry date"
								className="w-full"
							/>
						</Label>
					</div>
					<div className="grid gap-2 grid-cols-2">
						<Label htmlFor="colour" className="grid">
							<span>Colour</span>
							<Input
								id="colour"
								name="colour"
								type="text"
								value={form.colour}
								onChange={(e) =>
									setForm({ ...form, colour: e.target.value })
								}
								placeholder="Enter item's colour"
							/>
						</Label>
						<Label htmlFor="origin" className="grid">
							<span>Origin Place</span>
							<Input
								id="origin"
								name="origin"
								type="text"
								value={form.origin}
								onChange={(e) =>
									setForm({ ...form, origin: e.target.value })
								}
								placeholder="Enter item's origin place"
							/>
						</Label>
					</div>
					<div className="grid gap-2 grid-cols-2">
						<Label htmlFor="reorderlevel" className="grid">
							<span>Re-Order Level</span>
							<Input
								id="reorderlevel"
								name="reorderLevel"
								type="number"
								min={0}
								value={form.reorderLevel}
								onChange={(e) =>
									setForm({
										...form,
										reorderLevel: Number(e.target.value),
									})
								}
								placeholder="Enter item's re-order level"
							/>
						</Label>
					</div>
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
						onClick={handleUpdateItem}
						disabled={isUpdatingItem}
					>
						Update Item
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default UpdateItemModal;
