import { useNavigate, useParams } from "react-router-dom";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";
import useGetItem from "@/hooks/item/useGetItem";
import Loading from "@/components/Loading";
import useCheckAuth from "@/hooks/user/useCheckAuth";
import Button from "@/components/ui/button";
import DeleteItemModal from "@/components/modals/item/DeleteItemModal";
import { useState } from "react";
import { PanelLeftIcon } from "@/assets/icons/Docspage";
import UpdateItemModal from "@/components/modals/item/EditItemModal";
import { toast } from "react-toastify";
import useIsEmployee from "@/hooks/item/useIsEmployee";

function ItemPage() {
	const { SKU, orgSlug } = useParams();
	if (!SKU || !orgSlug) {
		toast.error("Item not found", { className: "toast" });
	}
	const { item, isPending } = useGetItem(SKU || "");
	const { user: userData, isPending: isGettingUser } = useCheckAuth();
	const { isEmployee, isPending: isCheckingStatus } = useIsEmployee(
		orgSlug || ""
	);
	const user = userData?.user;
	const navigate = useNavigate();

	const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
	const [openEditItemModal, setOpenEditItemModal] = useState(false);

	if (isPending || isGettingUser || isCheckingStatus) return <Loading />;
	return (
		<div className="flex flex-col justify-start gap-3 items-center bg-ls-bg-300 dark:bg-ls-bg-dark-800 min-h-dvh relative">
			<Navbar hide={{ userButton: true }}>
				<Button variant={"outline"} className="hidden md:flex" onClick={() => navigate(-1)}>
					<PanelLeftIcon /> Go Back
				</Button>
			</Navbar>
			{item ? (
				<main className="grid gap-2 p-2 rounded-2xl items-center w-full place-items-center">
					<ItemCard
						item={item}
						viewMorePath={user ? "/dashboard" : "/authenticate"}
						barebone={!isEmployee}
					/>
					{/* {!!isEmployee && (
						<div className="flex w-full gap-1">
							<Button
								variant={"secondary"}
								className="flex-1"
								onClick={() => setOpenEditItemModal(true)}
							>
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
								itemData={item}
							/>
							<UpdateItemModal
								open={openEditItemModal}
								setOpen={setOpenEditItemModal}
								item={item}
							/>
						</div>
					)} */}
				</main>
			) : (
				<div className="w-full flex flex-wrap justify-between px-6">
					<Button variant={"outline"} onClick={() => navigate(-1)}>
						<PanelLeftIcon /> Go Back
					</Button>
					<div className="grid place-items-center gap-2 p-2 min-w-md outline-1 rounded-2xl items-center">
						Not Item Found
					</div>
					<div className="w-20"></div>
				</div>
			)}
		</div>
	);
}

export default ItemPage;
