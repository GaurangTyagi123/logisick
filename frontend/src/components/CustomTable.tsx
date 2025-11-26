import { useEffect, useState, useMemo, type ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { H3, H4, Muted } from "./ui/Typography";
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
import { Separator } from "./ui/separator";

export interface Column<RowType> {
	key: string | keyof RowType;
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
function CustomTable<
	RowType extends Record<string, string | number | Date | boolean | object>
>({
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
				setSortOrder("asc");
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
		<Card className="bg-ls-bg-200 dark:bg-ls-bg-dark-800 w-full overflow-y-auto p-1 md:p-2">
			{/* Top bar items */}
			<CardHeader className="flex flex-row flex-wrap items-center justify-center md:justify-between space-y-0 px-2">
				<div className="flex items-center gap-2">
					{titleIcon}
					<H4>{title}</H4>
				</div>
				<div className="grid grid-cols-1 w-full sm:w-fit sm:grid-cols-2 gap-2">
					{/* Search input */}
					<Input
						value={searchStr || ""}
						onChange={(e) => setSearchStr(e.target.value)}
						type="text"
						placeholder="Search..."
						className="text-xs md:text-sm bg-white dark:bg-ls-bg-dark-800"
					/>

					{/* Sort by column */}
					<div className="flex gap-1 w-full">
						{/* sort by dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									className="text-xs md:text-sm flex-1"
								>
									Sort by:{" "}
									{sortColumn ? String(sortColumn) : "None"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="max-h-48 overflow-y-auto">
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
					</div>
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
			<CardContent className="overflow-x-auto scrollbar px-1 md:px-2">
				{(clientSide ? processedData : data).length === 0 ? (
					<div className="h-96 w-full grid place-items-center gap-3">
						<H3>No Data</H3>
					</div>
				) : (
					<Table className="min-h-64 w-full">
						<TableHeader className="w-full">
							<TableRow>
								{columns.map((col) => (
									<TableHead
										key={String(col.key)}
										// className="overflow-hidden text-ellipsis whitespace-nowrap"
									>
										{col.header}
									</TableHead>
								))}
							</TableRow>
						</TableHeader>
						<TableBody className="w-full">
							{(clientSide ? processedData : data).map(
								(row, index) => (
									<TableRow key={index}>
										{columns.map((col) => (
											<TableCell
												key={String(col.key) + index}
												className="overflow-hidden max-w-60 text-ellipsis whitespace-nowrap items-center text-xs md:text-sm"
											>
												{col.render
													? col.render(
															row[col.key],
															row
													  )
													: (row[
															col.key
													  ] as React.ReactNode) || (
															<Muted>NA</Muted>
													  )}
											</TableCell>
										))}
									</TableRow>
								)
							)}
						</TableBody>
					</Table>
				)}
			</CardContent>
			<Separator />
			<Separator />
			<CardFooter className="w-full flex justify-center items-center px-1 md:px-2">
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
