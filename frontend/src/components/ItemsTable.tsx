import useGetAllItems from "@/hooks/item/useGetAllItems";
import { getOrganization } from "@/services/apiOrg";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import CustomTableSkeleton from "./skeletons/CustomTableSkeleton";
import CustomTable from "./CustomTable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Muted } from "./ui/Typography";
import Button from "./ui/button";
import { Edit } from "@/assets/icons/Profilepage";
import { debounce } from "lodash";
import { searchItems } from "@/services/apiItem";

function prefereableWeightUnits(weight: number): string {
	if (weight >= 1000) return `${Math.round(weight / 10) / 100} Kg(s)`;
	else if (weight < 1 && weight > 0)
		return `${Math.round(weight * 100000) / 100} mg(s)`;
	return `${weight} g(s)`;
}

function ItemsTable() {
	const { orgSlug } = useParams();
	const PAGESIZE = 5;
	const [page, setPage] = useState<number>(1);
	const [totalPages, setTotalPages] = useState<number>(1);

	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});
	const { itemsResponse, isPending: isGettingItems } = useGetAllItems(
		orgData._id,
		page
	);

	const [searchResult, setSearchResults] = useState<Item[] | null>(null);

	const { mutate: search } = useMutation({
		mutationFn: searchItems,
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
		[orgData._id, search]
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
		if (!isGettingItems && itemsResponse) {
			setTotalPages(
				itemsResponse.count > PAGESIZE
					? Math.ceil(itemsResponse.count / PAGESIZE)
					: 1
			);
		}
	}, [itemsResponse, isGettingItems, totalPages]);

	if (isGettingItems || isGettingOrg) return <CustomTableSkeleton />;
	return (
		<CustomTable
			title="Items"
			columns={[
				{
					key: "name",
					header: "Name",
					render: (value) => (
						<span className="font-bold">{value}</span>
					),
				},

				{
					key: "importedOn",
					header: "Imported On",
					render: (value) => new Date(value).toDateString(),
				},
				{
					key: "expiresOn",
					header: "Expires On",
					render: (value) => {
						if (value) return new Date(value).toDateString();
						return <Muted>NA</Muted>;
					},
				},
				{ key: "inventoryCategory", header: "Category" },
				{
					key: "batchNumber",
					header: "Batch No.",
					render: (value) => (value ? value : <Muted>NA</Muted>),
				},
				{
					key: "weight",
					header: "Unit Weight",
					render: (weight) => prefereableWeightUnits(weight),
				},
				{ key: "quantity", header: "Quantity" },
				{
					key: "costPrice",
					header: "Cost Price",
					render: (value) => (
						<span className="w-full font-bold text-red-400">
							{value} /-
						</span>
					),
				},
				{
					key: "sellingPrice",
					header: "Selling Price",
					render: (value) => (
						<span className="w-full font-bold text-green-400">
							{value} /-
						</span>
					),
				},
				{
					key: "Manage",
					header: "Manage",
					render: (_, row) => (
						<Link to={`/item/${orgData.slug}/${row.SKU}`}>
							<Button variant={"link"}>
								<Edit />
							</Button>
						</Link>
					),
				},
			]}
			clientSide
			data={searchResult ? searchResult : itemsResponse?.items || []}
			currentPage={page}
			totalPages={totalPages}
			setPage={setPage}
			onSearch={handleSearchWrapper}
		/>
	);
}

export default ItemsTable;
