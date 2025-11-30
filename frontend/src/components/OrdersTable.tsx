import useGetAllOrders from "@/hooks/order/useGetAllOrders";
import { searchOrders } from "@/services/apiOrder";
import { getOrganization } from "@/services/apiOrg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";
import CustomTable from "@/components/CustomTable";
import { Badge } from "@/components/ui/badge";
import { Small } from "@/components/ui/Typography";
import Button from "@/components/ui/button";
import useDeleteOrder from "@/hooks/order/useDeleteOrder";
import { Delete } from "@/assets/icons/Profilepage";
import useUpdateOrder from "@/hooks/order/useUpdateOrder";
const DeleteOrderModal = lazy(
	() => import("@/components/modals/order/DeleteOrderModal")
);
const UpdateOrderModal = lazy(
	() => import("@/components/modals/order/UpdateOrderModal")
);

/**
 * @component table to show and manage orders in organization
 * @author `Ravish Ranjan`
 */
function OrdersTable() {
	// hook to get orgation's slug
	const { orgSlug } = useParams();
	// const variable to maintain page size
	const PAGESIZE = 5;
	// state to manage page number
	const [page, setPage] = useState<number>(1);
	// state to manage total pages
	const [totalPages, setTotalPages] = useState<number>(1);
	// state to maintain open state of delete order modal
	const [openDeleteOrderModal, setOpenDeleteOrderModal] = useState(false);
	// state to maintain open state of update order modal
	const [openUpdateOrderModal, setOpenUpdateOrderModal] = useState(false);
	// state to maintain form of data to delete order
	const [deleteOrderForm, setDeleteOrderForm] = useState<{
		orderName?: string;
		_id: string;
	}>({
		orderName: "",
		_id: "",
	});
	// state to maintain form of data to update order
	const [updateOrderForm, setUpdateOrderForm] = useState<shipmentType>({
		_id: "",
		item: {
			_id: "",
			quantity: 1,
		},
		orderName: "",
		quantity: 1,
		shipped: false,
		orderedOn: new Date(),
		organizationId: "",
	});
	// hook to get organization data
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	// hook used to get all orders
	const { ordersResponse, isGettingOrders } = useGetAllOrders(
		orgData?._id,
		page
	);
	// hook used to delete order
	const { deleteOrderFn, isDeletingOrder } = useDeleteOrder();
	// hook used to update order
	const { isUpdatingOrder, updateOrderFn } = useUpdateOrder();
	// state used to maintain search result
	const [searchResult, setSearchResults] = useState<shipmentType[] | null>(
		null
	);
	// mutation hook to hanlde search on order table
	const { mutate: search } = useMutation({
		mutationFn: searchOrders,
		onSettled: (data) => {
			if (data) {
				setSearchResults(data.orders);
			} else return;
		},
	});
	const controllerRef = useRef<AbortController>(null);
	const handleSearch = useCallback(
		async (query: string) => {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
			const controller = new AbortController();
			controllerRef.current = controller;
			if (query.trim().length)
				return search({ orgid: orgData._id, query, controller });
		},
		[orgData?._id, search]
	);
	const debouncedSearch = useMemo(() => {
		return debounce(handleSearch, 500);
	}, [handleSearch]) as ((searchTerm: string) => void) & {
		cancel: () => void;
	};

	// Wrapper function to handle immediate clear
	const handleSearchWrapper = useCallback(
		(query: string) => {
			// Immediately clear if empty (don't debounce)
			if (query.trim() === "") {
				debouncedSearch.cancel(); // Cancel any pending searches
				setSearchResults(null);
				if (controllerRef.current) {
					controllerRef.current.abort();
				}
				return;
			}
			// Otherwise use debounced search
			debouncedSearch(query);
		},
		[debouncedSearch]
	);

	useEffect(() => {
		if (!isGettingOrders && ordersResponse) {
			setTotalPages(
				ordersResponse.count > PAGESIZE
					? Math.ceil(ordersResponse.count / PAGESIZE)
					: 1
			);
		}
	}, [ordersResponse, isGettingOrders, totalPages]);

	if (isGettingOrders || isGettingOrg) return <CustomTableSkeleton />;
	return (
		<>
			<CustomTable
				title="Orders"
				columns={[
					{
						key: "orderName",
						header: "Order Name",
						render: (value) => (
							<Small>
								{value instanceof Date
									? new Date(value).toLocaleDateString()
									: JSON.stringify(value)}
							</Small>
						),
					},
					{
						key: "quantity",
						header: "Quantity",
					},
					{
						key: "orderedOn",
						header: "Ordered On",
						render: (value) => {
							if (!value) return "N/A";
							return new Date(
								value as string | number | Date
							).toLocaleDateString();
						},
					},
					{
						key: "shipped",
						header: "Shipment Status",
						render: (value) => (
							<Badge variant={value ? "teritiary" : "secondary"}>
								{value ? "Shipped" : "Under Process"}
							</Badge>
						),
					},
					{
						key: "manage",
						header: "Manage",
						render: (_, row) => (
							<div className="flex gap-2 items-center">
								{/* edit */}
								<Button
									disabled={isUpdatingOrder}
									onClick={() => {
										console.log(
											"row data before update",
											row
										);
										setUpdateOrderForm(row);
										setOpenUpdateOrderModal(true);
									}}
									variant={"outline"}
									size={"sm"}
									className="text-xs sm:text-sm"
								>
									Update
								</Button>
								{/* delete employee */}
								<Button
									disabled={isDeletingOrder}
									onClick={() => {
										setDeleteOrderForm({
											_id: row._id,
											orderName: row.orderName,
										});
										setOpenDeleteOrderModal(true);
									}}
									variant={"destructive"}
									title={`Remove ${row.orderName} from orders`}
									size={"sm"}
								>
									<Delete />
								</Button>
							</div>
						),
					},
				]}
				clientSide
				data={
					searchResult ? searchResult : ordersResponse?.orders || []
				}
				currentPage={page}
				totalPages={totalPages}
				setPage={setPage}
				onSearch={handleSearchWrapper}
			/>
			<DeleteOrderModal
				open={openDeleteOrderModal}
				setOpen={setOpenDeleteOrderModal}
				orderData={deleteOrderForm}
				deleteOrderFn={deleteOrderFn}
				isDeletingOrder={isDeletingOrder}
			/>
			<UpdateOrderModal
				open={openUpdateOrderModal}
				setOpen={setOpenUpdateOrderModal}
				orderData={updateOrderForm}
				isUpdatingOrder={isUpdatingOrder}
				updateOrderFn={updateOrderFn}
			/>
		</>
	);
}

export default OrdersTable;
