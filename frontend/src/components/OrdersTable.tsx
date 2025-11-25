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

function OrdersTable() {
	const { orgSlug } = useParams();
	const PAGESIZE = 5;
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);
	const [openDeleteOrderModal, setOpenDeleteOrderModal] = useState(false);
	const [deleteOrderForm, setDeleteOrderForm] = useState<{
		orderName?: string;
		_id: string;
	}>({
		orderName: "",
		_id: "",
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

	const [searchResult, setSearchResults] = useState<
		| {
				_id: string;
				orderName?: string;
				quantity: number;
				orderedOn: Date;
				shipped: boolean;
		  }[]
		| null
	>(null);

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
									: value}
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
							<>
								{/* edit */}
								{/* <Button
									disabled={isChangingManager}
									onClick={() => {
										setEmpData({
											_id: row._id,
											name: row.name,
											email: row.email,
										});
										setChangeManagerModalOpen(true);
									}}
									variant={"outline"}
									title={`Remove ${row.name} from organization`}
									size={"sm"}
									className="text-xs ms:text-sm"
								>
									Manager
								</Button> */}
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
							</>
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
		</>
	);
}

export default OrdersTable;
