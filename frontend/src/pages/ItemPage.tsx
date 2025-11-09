import { useParams } from "react-router-dom";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";
import useGetItem from "@/hooks/item/useGetItem";
import Loading from "@/components/Loading";
import useCheckAuth from "@/hooks/user/useCheckAuth";
import Button from "@/components/ui/button";
import useDeleteItem from "@/hooks/item/useDeleteItem";
import DeleteItemModal from "@/components/modals/item/DeleteItemModal";
import { useState } from "react";

function ItemPage() {
	const { SKU } = useParams();
	const { item, isPending } = useGetItem(SKU || "");
	const { user: userData, isPending: isGettingUser } = useCheckAuth();
	const user = userData?.user;
	const { deleteItemFn, isPending: isDeletingItem } = useDeleteItem();

	const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
	// const [openEditItemModal, setOpenEditItemModal] = useState(false);

	if (isPending || isGettingUser) return <Loading />;
	return (
		<div className="flex flex-col gap-3 items-center bg-ls-bg-300 dark:bg-ls-bg-dark-800 min-h-screen relative">
			<Navbar hide={{ userButton: true }} />
			{item ? (
				<div className="grid gap-2 p-2 outline-1 rounded-2xl items-center">
					<ItemCard
						item={item}
						barebone={!user}
						viewMorePath={user ? "/dashboard" : "/authenticate"}
					/>
					{user && (
						<div className="flex w-full gap-2">
							<Button variant={"secondary"} className="flex-1">
								Edit Item Data
							</Button>
							<Button
								variant={"destructive"}
								className="flex-1"
								onClick={() => setOpenDeleteItemModal(true)}
							>
								Delete Data
							</Button>
							<DeleteItemModal
								open={openDeleteItemModal}
								setOpen={setOpenDeleteItemModal}
								isPending={isDeletingItem}
								itemData={item}
								deleteItem={deleteItemFn}
							/>
						</div>
					)}
				</div>
			) : (
				<div>Not Item Found</div>
			)}
		</div>
	);
}

export default ItemPage;
