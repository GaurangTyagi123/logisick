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
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAddItem from "@/hooks/item/useAddItem";
import { getOrganization } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

interface AddItemModalProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
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

function AddItemModal({ open, setOpen }: AddItemModalProps) {
	const { isPending: isAddingItem, addItemFn } = useAddItem();
	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});

	const [weightUnit, setWeightUnit] = useState<"MG" | "G" | "KG">("KG");

	const [form, setForm] = useState<{
		name: string;
		organizationId: string;
		costPrice: number;
		sellingPrice: number;
		quantify: number;
		inventoryCategory: string;
		importance: "A" | "B" | "C";
		importedOn: Date;
		expiresOn?: Date;
		weight?: number;
		colour?: string;
		reorderLevel?: number;
		batchNumber?: number;
		origin?: string;
	}>({
		name: "",
		organizationId: "",
		costPrice: 0,
		sellingPrice: 0,
		quantify: 1,
		inventoryCategory: "",
		importance: "C",
		importedOn: new Date(),
		weight: 1,
	});

	const handleAddItem = () => {
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

		if (form.importedOn > new Date())
			return toast.warning("Imported data can't be in future", {
				className: "toast",
			});

		if (form.expiresOn && form.expiresOn < new Date())
			return toast.warning("Expired item can't be added", {
				className: "toast",
			});

		if (form.weight && form.weight <= 0)
			return toast.warning("Item can't be weightless", {
				className: "toast",
			});
		const submitForm: {
			name: string;
			organizationId: string;
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
			batchNumber?: number;
			origin?: string;
			SKU?: string;
		} = JSON.parse(JSON.stringify(form));
		submitForm.importedOn = form.importedOn.toISOString();
		submitForm.expiresOn = form.expiresOn?.toISOString();
		submitForm.organizationId = orgData._id;
		submitForm.weight = weightInGrams(weightUnit, form.weight);
		submitForm.name = submitForm.name.trim();
		submitForm.inventoryCategory = submitForm.inventoryCategory.trim();
		submitForm.colour = submitForm.colour?.trim();
		submitForm.origin = submitForm.origin?.trim();
		submitForm.SKU = submitForm.SKU?.trim();
		addItemFn(submitForm);
		setOpen(false);
	};

	return (
		<Modal openModal={open}>
			<Card className="min-w-lg max-w-screen">
				<div>
					<BarcodeScan setForm={setForm} />
				</div>
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Add new item</CardTitle>
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
							<span>Name *</span>
							<Input
								id="name"
								name="name"
								type="text"
								value={form.name}
								onChange={(e) =>
									setForm({ ...form, name: e.target.value })
								}
								placeholder="Enter item's name"
								required
							/>
						</Label>
						<Label htmlFor="inventory-category" className="grid">
							<span>Inventory Category *</span>
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
								required
							/>
						</Label>
					</div>
					{/* costs */}
					<div className="grid grid-cols-2 gap-2">
						<Label htmlFor="costprice" className="grid">
							<span>Cost Price *</span>
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
							<span>Selling Price *</span>
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
							<span>Quantity *</span>
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
						<span>Importance *</span>
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
							<span>Imported On *</span>
							<Input
								id="importedon"
								name="importedOn"
								type="date"
								value={
									form.importedOn.toISOString().split("T")[0]
								}
								max={
									form.importedOn.toISOString().split("T")[0]
								}
								onChange={(e) => {
									setForm({
										...form,
										importedOn: new Date(
											e.target.valueAsDate ||
											form.importedOn
										),
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
									form.expiresOn?.toISOString().split("T")[0]
								}
								min={
									form.expiresOn
										?.toISOString()
										.split("T")[0] ||
									new Date().toISOString().split("T")[0]
								}
								onChange={(e) => {
									setForm({
										...form,
										expiresOn: e.target.valueAsDate
											? new Date(e.target.valueAsDate)
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
						<Label htmlFor="batchnumber" className="grid">
							<span>Batch Number</span>
							<Input
								id="batchnumber"
								name="batchNumber"
								type="number"
								min={0}
								value={form.batchNumber}
								onChange={(e) =>
									setForm({
										...form,
										batchNumber: Number(e.target.value),
									})
								}
								placeholder="Enter item's batch number"
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
						onClick={handleAddItem}
						disabled={isAddingItem || isGettingOrg}
					>
						Add Item
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default AddItemModal;
