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

function OrdersTable() {
	const { orgSlug } = useParams();
	const PAGESIZE = 5;
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	// const { itemsResponse, isGettingItems } = useGetAllOrders(orgData._id, page);
	const { ordersResponse, isGettingOrders } = useGetAllOrders(
		orgData?._id,
		page
	);

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
				setSearchResults(data.items);
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
		<CustomTable
			title="Orders"
			columns={[
				{
					key: "orderName",
					header: "Order Name",
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
			]}
			clientSide
			data={searchResult ? searchResult : ordersResponse?.orders || []}
			currentPage={page}
			totalPages={totalPages}
			setPage={setPage}
			onSearch={handleSearchWrapper}
		/>
	);
}

export default OrdersTable;
