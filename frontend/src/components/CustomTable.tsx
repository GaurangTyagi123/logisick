import { useEffect, useState, useMemo, type ReactNode, useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { H3, H4, Muted } from "@/components/ui/Typography";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import Button from "@/components/ui/button";
import { Desc, Incr, Sort } from "@/assets/icons/Table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import Pagination from "@/components/Pagination";
import { Separator } from "@/components/ui/separator";

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

/**
 * @objective customizable table to be used every place where a table is needed
 * @param {string} title title to put on top of the title
 * @param {ReactNode} titleIcon icon to display with title
 * @param {RowType[]} data data to display in the table
 * @param {Column<RowType>[]} columns list of column and its type to display data
 * @param {FilterOption<RowType>[]} filterOptions options to filter the data with
 * @param {number} currentPage current page 
 * @param {number} totalPages total no. of pages on data
 * @param {Function} setPage function to change current page on the data
 * @param {Function} onSearch function to apply searching to the data
 * @param {Function} onSort function to apply sorting to the data
 * @param {Function} onFilter function to apply filters to the data
 * @param {boolean} clientSide state whether the table should be manages server side or client side 
 * @author `Ravish Ranjan`
 */
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
	const searchRef = useRef<HTMLInputElement>(null);

	// Set focus on search bar when the page renders for the first time	
	useEffect(() => {
		searchRef?.current?.focus();
	},[])

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

	/**
	 * @brief function to sort data with
	 * @param column column to sort the data with
	 */
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

	/**
	 * @brief function to change the sorting order (increasing | decreasing)
	 */
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

	/**
	 * @brief function to handle filtering of data in table
	 * @param filterKey column key to filter data with
	 * @param value the value by which t o filter
	 */
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

	/**
	 * @brief function to clear the filter on the data
	 */
	const clearFilters = () => {
		setFilters({});
	};

	// Client-side processing
	const processedData = useMemo(() => {
		if (!clientSide) return data;

		let result = [...data];

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

	// variable to count active filters
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
						ref={searchRef}
						value={searchStr || ""}
						onChange={(e) => setSearchStr(e.target.value)}
						type="search"
						placeholder="Search..."
						className="text-xs md:text-sm bg-white dark:bg-ls-bg-dark-800"
						aria-autocomplete="list"
						aria-live="polite"
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
					<Table className="min-h-64 w-full" aria-label="table">
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
