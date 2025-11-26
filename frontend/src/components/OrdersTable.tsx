import useGetAllOrders from "@/hooks/order/useGetAllOrders";
import { searchOrders } from "@/services/apiOrder";
import { getOrganization } from "@/services/apiOrg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import CustomTableSkeleton from "./skeletons/CustomTableSkeleton";
import CustomTable from "./CustomTable";
import { Badge } from "./ui/badge";
import { Small } from "./ui/Typography";
import Button from "./ui/button";
import useDeleteOrder from "@/hooks/order/useDeleteOrder";
import { Delete } from "@/assets/icons/Profilepage";
import DeleteOrderModal from "./modals/order/DeleteOrderModal";
import useUpdateOrder from "@/hooks/order/useUpdateOrder";
import UpdateOrderModal from "./modals/order/UpdateOrderModal";

function OrdersTable() {
	const { orgSlug } = useParams();
	const PAGESIZE = 5;
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [openDeleteOrderModal, setOpenDeleteOrderModal] = useState(false);
	const [openUpdateOrderModal, setOpenUpdateOrderModal] = useState(false);
	const [deleteOrderForm, setDeleteOrderForm] = useState<{
		orderName?: string;
		_id: string;
	}>({
		orderName: "",
		_id: "",
	});
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

	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	// const { itemsResponse, isGettingItems } = useGetAllOrders(orgData._id, page);
	const { ordersResponse, isGettingOrders } = useGetAllOrders(
		orgData?._id,
		page
	);
	const { deleteOrderFn, isDeletingOrder } = useDeleteOrder();
	const { isUpdatingOrder, updateOrderFn } = useUpdateOrder();

	const [searchResult, setSearchResults] = useState<shipmentType[] | null>(
		null
	);

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
