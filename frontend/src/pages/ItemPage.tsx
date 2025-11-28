import { useNavigate, useParams } from "react-router-dom";
import ItemCard from "@/components/ItemCard";
import Navbar from "@/components/Navbar";
import useGetItem from "@/hooks/item/useGetItem";
import Loading from "@/components/Loading";
import useCheckAuth from "@/hooks/user/useCheckAuth";
import Button from "@/components/ui/button";
import { lazy, useState } from "react";
import { PanelLeftIcon } from "@/assets/icons/Docspage";
import { toast } from "react-toastify";
import useIsEmployee from "@/hooks/item/useIsEmployee";
const UpdateItemModal = lazy(() => import("@/components/modals/item/EditItemModal")) ;
const DeleteItemModal = lazy(() => import("@/components/modals/item/DeleteItemModal")) ;

/**
 * @component page to server as endpoint for item page
 * @author `Ravish Ranjan`
 */
function ItemPage() {
	// hook to get organization slug
	const { SKU, orgSlug } = useParams();
	if (!SKU || !orgSlug) {
		toast.error("Item not found", { className: "toast" });
	}
	// item getting hook
	const { item, isGettingItem } = useGetItem(SKU || "");
	// user data getting hook
	const { user: userData, isCheckingAuth } = useCheckAuth();
	// employee data getting hook
	const { isEmployee, isCheckingEmployment } = useIsEmployee(
		orgSlug || ""
	);
	const user = userData?.user;
	const navigate = useNavigate();
	// delete item modal open state
	const [openDeleteItemModal, setOpenDeleteItemModal] = useState(false);
	// edit item modal open state
	const [openEditItemModal, setOpenEditItemModal] = useState(false);

	if (isGettingItem || isCheckingAuth || isCheckingEmployment) return <Loading />;
	return (
		<div className="flex flex-col justify-start gap-3 items-center bg-ls-bg-300 dark:bg-ls-bg-dark-800 min-h-dvh relative">
			<Navbar hide={{ userButton: true }}>
				<Button variant={"outline"} onClick={() => navigate(-1)}>
					<PanelLeftIcon /> <span className="hidden sm:flex">Go Back</span>
				</Button>
			</Navbar>
			{item ? (
				<main className="grid gap-2 p-2 rounded-2xl items-center place-items-center">
					<ItemCard
						item={item}
						orgSlug={orgSlug || ""}
						viewMorePath={user ? "/dashboard" : "/authenticate"}
						barebone={!isEmployee}
					/>
					{!!isEmployee && (
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
					)}
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
