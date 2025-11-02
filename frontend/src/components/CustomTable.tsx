import { useEffect, useState, useMemo, type ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { H3, Large } from "./ui/Typography";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import Button from "./ui/button";
import { Desc, Incr, Sort } from "@/assets/icons/Table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import Pagination from "./Pagination";

export interface Column<RowType> {
	key: keyof RowType;
	header: string;
	sortable?: boolean; // whether this column is sortable
	searchable?: boolean; // whether to include this column in search
	render?: (value: RowType[keyof RowType], row: RowType) => React.ReactNode;
}

export interface FilterOption<RowType> {
	key: keyof RowType;
	label: string;
	options: { value: string | number; label: string }[];
}

export type SortOrder = "asc" | "desc" | null;

interface CustomTableProps<RowType> {
	title: string;
	titleIcon?: ReactNode;
	data: RowType[];
	columns: Column<RowType>[];
	filterOptions?: FilterOption<RowType>[];

	// Pagination props
	currentPage: number;
	limit?: number;
	totalPages: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;

	// Callback props for server-side operations (optional)
	onSearch?: (searchTerm: string) => void;
	onSort?: (column: keyof RowType | null, order: SortOrder) => void;
	onFilter?: (filters: Record<string, (string | number)[]>) => void;

	// If true, sorting/filtering/searching happens client-side
	clientSide?: boolean;
}
function CustomTable<RowType extends Record<string, string>>({
	title,
	titleIcon,
	data,
	columns,
	filterOptions = [],
	currentPage,
	totalPages,
	setPage,
	onSearch,
	onSort,
	onFilter,
	clientSide = false,
}: CustomTableProps<RowType>) {
	const [searchStr, setSearchStr] = useState<string | null>(null);
	const [sortColumn, setSortColumn] = useState<keyof RowType | null>(null);
	const [sortOrder, setSortOrder] = useState<SortOrder>(null);
	const [filters, setFilters] = useState<Record<string, (string | number)[]>>(
		{}
	);

	// Trigger search callback
	useEffect(() => {
		if (searchStr && onSearch) {
			onSearch(searchStr as string);
			setPage(1);
		}
	}, [searchStr, onSearch, setPage]);

	// Trigger sort callback
	useEffect(() => {
		if (onSort && !clientSide) {
			onSort(sortColumn, sortOrder);
			setPage(1);
		}
	}, [sortColumn, sortOrder, onSort, clientSide, setPage]);

	// Trigger filter callback
	useEffect(() => {
		if (onFilter && !clientSide) {
			onFilter(filters);
			setPage(1);
		}
	}, [filters, onFilter, clientSide, setPage]);

	const handleSort = (column: keyof RowType) => {
		if (sortColumn === column) {
			// Cycle through: asc -> desc -> null
			if (sortOrder === "asc") {
				setSortOrder("desc");
			} else if (sortOrder === "desc") {
				setSortOrder(null);
				setSortColumn(null);
			}
		} else {
			setSortColumn(column);
			setSortOrder("asc");
		}
	};

	const handleChangeSortOrder = () => {
		switch (sortOrder) {
			case "asc":
				setSortOrder("desc");
				break;
			case "desc":
				setSortOrder(null);
				setSortColumn(null);
				break;
			case null:
				if (sortColumn) {
					setSortOrder("asc");
				}
				break;
		}
	};

	const handleFilterChange = (filterKey: string, value: string | number) => {
		setFilters((prev) => {
			const currentValues = prev[filterKey] || [];
			const newValues = currentValues.includes(value)
				? currentValues.filter((v) => v !== value)
				: [...currentValues, value];

			if (newValues.length === 0) {
				const { [filterKey]: _some, ...rest } = prev;
				return rest;
			}

			return { ...prev, [filterKey]: newValues };
		});
	};

	const clearFilters = () => {
		setFilters({});
	};

	// Client-side processing
	const processedData = useMemo(() => {
		if (!clientSide) return data;

		let result = [...data];

		// Search
		// if (searchStr) {
		// 	const searchLower = searchStr.toLowerCase();
		// 	result = result.filter((row) =>
		// 		columns.some((col) => {
		// 			if (col.searchable === false) return false;
		// 			const value = row[col.key];
		// 			return String(value).toLowerCase().includes(searchLower);
		// 		})
		// 	);
		// }

		// Filter
		Object.entries(filters).forEach(([key, values]) => {
			if (values.length > 0) {
				result = result.filter((row) =>
					values.includes(String(row[key as keyof RowType]))
				);
			}
		});

		// Sort
		if (sortColumn && sortOrder) {
			result.sort((a, b) => {
				const aVal = a[sortColumn];
				const bVal = b[sortColumn];

				if (aVal === bVal) return 0;

				const comparison = aVal > bVal ? 1 : -1;
				return sortOrder === "asc" ? comparison : -comparison;
			});
		}

		return result;
	}, [data, filters, sortColumn, sortOrder, clientSide]);

	const activeFilterCount = Object.values(filters).reduce(
		(sum, arr) => sum + arr.length,
		0
	);

	return (
		<Card className="bg-ls-bg-200 dark:bg-ls-bg-dark-800">
			<CardHeader className="flex flex-row flex-wrap items-center justify-between space-y-0">
				<div className="flex items-center gap-2">
					{titleIcon}
					<Large>{title}</Large>
				</div>
				<div className="flex gap-2 flex-wrap">
					{/* Search input */}
					<Input
						value={searchStr || ""}
						onChange={(e) => setSearchStr(e.target.value)}
						type="text"
						placeholder="Search..."
						className="w-full md:w-64"
					/>

					{/* Sort by column */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								Sort by:{" "}
								{sortColumn ? String(sortColumn) : "None"}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuItem
								className="cursor-pointer"
								onClick={() => {
									setSortColumn(null);
									setSortOrder(null);
								}}
							>
								None
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							{columns
								.filter((col) => col.sortable !== false)
								.map((col) => (
									<DropdownMenuItem
										key={String(col.key)}
										className="cursor-pointer"
										onClick={() => handleSort(col.key)}
									>
										{col.header}
										{sortColumn === col.key && (
											<span className="ml-2">
												{sortOrder === "asc"
													? "↑"
													: "↓"}
											</span>
										)}
									</DropdownMenuItem>
								))}
						</DropdownMenuContent>
					</DropdownMenu>

					{/* Sort order toggle */}
					<Button
						onClick={handleChangeSortOrder}
						title={sortOrder || "no order"}
						variant="outline"
						disabled={!sortColumn}
					>
						{sortOrder === "asc" && <Incr />}
						{sortOrder === "desc" && <Desc />}
						{sortOrder === null && <Sort />}
					</Button>

					{/* Filter */}
					{filterOptions.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									Filter{" "}
									{activeFilterCount > 0 &&
										`(${activeFilterCount})`}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								{filterOptions.map((filterOpt) => (
									<div key={String(filterOpt.key)}>
										<DropdownMenuLabel>
											{filterOpt.label}
										</DropdownMenuLabel>
										{filterOpt.options.map((opt) => (
											<DropdownMenuCheckboxItem
												key={opt.value}
												checked={
													filters[
														String(filterOpt.key)
													]?.includes(opt.value) ||
													false
												}
												onCheckedChange={() =>
													handleFilterChange(
														String(filterOpt.key),
														opt.value
													)
												}
											>
												{opt.label}
											</DropdownMenuCheckboxItem>
										))}
										<DropdownMenuSeparator />
									</div>
								))}
								{activeFilterCount > 0 && (
									<DropdownMenuItem
										className="cursor-pointer justify-center"
										onClick={clearFilters}
									>
										Clear all filters
									</DropdownMenuItem>
								)}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardHeader>

			<Separator />

			<CardContent className="overflow-x-auto">
				{(clientSide ? processedData : data).length === 0 ? (
					<div className="h-64 w-full grid place-items-center gap-3">
						<H3>No Data</H3>
					</div>
				) : (
					<Table>
						<TableHeader>
							<TableRow>
								{columns.map((col) => (
									<TableHead key={String(col.key)}>
										{col.header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody>
							{(clientSide ? processedData : data).map(
								(row, index) => (
									<TableRow key={index} className="">
										{columns.map((col) => (
											<TableCell
												key={String(col.key) + index}
												className="overflow-hidden text-ellipsis whitespace-nowrap max-w-4/10"
											>
												{col.render
													? col.render(
															row[col.key],
															row
													  )
													: (row[
															col.key
													  ] as React.ReactNode)}
											</TableCell>
										))}
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>

			<CardFooter className="w-full flex justify-center items-center">
				<Pagination
					currentPage={currentPage}
					handlePageClick={(pageno) => setPage(pageno)}
					totalPages={totalPages}
				/>
			</CardFooter>
		</Card>
	);
}

export default CustomTable;

/* 
? client side
<CustomTable
	title="somthing"
	titleIcon={<Shield />}
	clientSide
	columns={[
		{ key: "id", header: "Sno." },
		{ key: "name", header: "Name" },
		{ key: "age", header: "Age" },
		{key:"surname",header:"Surname"}
	]}
	data={[
		{ id: "1", name: "Ravish Ranjan a", age: 1 ,surname:"Ranjan"},
		{ id: "2", name: "Ravish Ranjan b", age: 2 ,surname:"Ranjan"},
		{ id: "3", name: "Ravish Ranjan c", age: 3 ,surname:"Ranjan"},
		{ id: "4", name: "Ravish Ranjan d", age: 4 ,surname:"Ranjan"},
		{ id: "5", name: "Ravish Ranjan e", age: 5 ,surname:"Ranjan"},
	]}
	currentPage={page}
	totalPages={1}
	setPage={setpage}
/>
? server side
<CustomTable
  data={data}
  columns={columns}
  onSearch={(term) => fetchData({ search: term })}
  onSort={(col, order) => fetchData({ sortBy: col, sortOrder: order })}
  onFilter={(filters) => fetchData({ filters })}
  currentPage={page}
  totalPages={total}
  setPage={setPage}
/>
*/
