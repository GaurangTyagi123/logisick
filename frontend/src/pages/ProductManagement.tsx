import AddItemModal from "@/components/modals/item/AddItemModal";
import Button from "@/components/ui/button";
import { H3 } from "@/components/ui/Typography";
import { useState } from "react";

function ProductManagement() {
	const [openAddItemModal, setOpenAddItemModal] = useState<boolean>(false);

	return (
		<div className="grid gap-2 min-h-96">
			<div className="flex flex-col gap-2 items-baseline h-full w-auto jet-brains rounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
				{/* top tab */}
				<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-3 rounded-2xl flex justify-between items-center">
					<H3>Product Management</H3>
					<Button onClick={() => setOpenAddItemModal(true)}>
						Add New Item
					</Button>
				</div>
				{/* main menu */}
				<main className="outline-1 w-full rounded-2xl p-4 h-full"></main>
				<AddItemModal
					open={openAddItemModal}
					setOpen={setOpenAddItemModal}
				/>
			</div>
		</div>
	);
}

export default ProductManagement;
