import ItemsTable from "@/components/ItemsTable";
import AddItemModal from "@/components/modals/item/AddItemModal";
import Button from "@/components/ui/button";
import { H3 } from "@/components/ui/Typography";
import { useState } from "react";

function ProductManagement() {
	const [openAddItemModal, setOpenAddItemModal] = useState<boolean>(false);

	return (
		<div className="grid gap-2 min-h-96 w-full ">
			{/* top tab */}
			<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-3 rounded-2xl flex justify-between items-center">
				<H3>Product Management</H3>
				<Button onClick={() => setOpenAddItemModal(true)}>
					Add New Item
				</Button>
			</div>
			{/* main menu */}
			<main className="w-full rounded-2xl h-full">
				<ItemsTable />
			</main>
			<AddItemModal
				open={openAddItemModal}
				setOpen={setOpenAddItemModal}
			/>
		</div>
	);
}

export default ProductManagement;
