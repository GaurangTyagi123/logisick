import { useEffect, useState, type ReactNode } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { H3, Large } from "./ui/Typography";
import { Separator } from "./ui/separator";
import { Input } from "./ui/input";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
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
	render?: (value: RowType[keyof RowType], row: RowType) => React.ReactNode; // optional custom render function
}

interface CustomTableProps<RowType> {
	title: string;
	titleIcon?: ReactNode;
	data: RowType[];
	columns: Column<RowType>[];

	currentPage: number;
	totalPages: number;
	setPage: React.Dispatch<React.SetStateAction<number>>;
}

// interface CustomTableProps {
// 	title: string;
// 	titleIcon?: ReactNode;
// }

function CustomTable<RowType>({
	title,
	titleIcon,
	data,
	columns,
	currentPage,
	totalPages,
    setPage
}: CustomTableProps<RowType>) {
	const [searchStr, setSearchStr] = useState<string>("");
	const [debouncedSearchStr, setDebouncedSearchStr] = useState(searchStr);
	const [sortOrder, setSortOrder] = useState<
		"increasing" | "decreasing" | null
	>(null);

	const handleSort = (by: string) => {
		console.log("sorted by :", by);
	};

	const handleChangeSortOrder = () => {
		switch (sortOrder) {
			case "increasing": {
				setSortOrder("decreasing");
				console.log("sort order : decreasing");
				break;
			}
			case "decreasing": {
				setSortOrder(null);
				console.log("sort order : null");
				break;
			}
			case null: {
				setSortOrder("increasing");
				console.log("sort order : increasing");
				break;
			}
			default: {
				setSortOrder(null);
			}
		}
	};

	// changin debounce search string on delay on search string change
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedSearchStr(searchStr);
		}, 1000);

		return () => {
			clearTimeout(handler);
		};
	}, [searchStr]);

	// actually seraching based on debounced search string
	useEffect(() => {
		if (debouncedSearchStr) {
			console.log("searched for :", debouncedSearchStr);
		}
	}, [debouncedSearchStr]);

	return (
		<Card className="bg-ls-bg-200 dark:bg-ls-bg-dark-800">
			<CardHeader className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					{titleIcon}
					<Large>{title}</Large>
				</div>
				<div className="flex gap-1">
					{/* search input */}
					<Input
						value={searchStr}
						onChange={(e) => setSearchStr(e.target.value)}
						type="text"
						placeholder="search"
					/>
					{/* sort by options */}
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button>Sort by</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{columns.map((col) => {
								return (
									<DropdownMenuItem
										key={String(col.key) + "sortby"}
										className="cursor-pointer"
										onClick={() =>
											handleSort(String(col.key))
										}
									>
										{col.header}
									</DropdownMenuItem>
								);
							})}
						</DropdownMenuContent>
					</DropdownMenu>
					{/* sort order */}
					<Button
						onClick={handleChangeSortOrder}
						title={sortOrder || "no order"}
					>
						{sortOrder === "increasing" && <Incr />}
						{sortOrder === "decreasing" && <Desc />}
						{sortOrder === null && <Sort />}
					</Button>
					{/* filter */}
				</div>
			</CardHeader>
			<Separator />
			<CardContent>
				{data.length === 0 ? (
					<div className="h-full w-full grid place-items-center gap-3">
						<H3>No Data</H3>
					</div>
				) : (
					<Table className="outline-1 rounded-2xl">
						<TableHeader>
							<TableRow>
								{columns.map((col) => {
									return (
										<TableHead key={String(col.key)}>
											{col.header}
										</TableHead>
									);
								})}
							</TableRow>
						</TableHeader>
						<TableBody>
							{data.map((row, index) => {
								return (
									<TableRow key={index}>
										{columns.map((col) => {
											return (
												<TableCell
													key={
														String(col.key) + index
													}
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
											);
										})}
									</TableRow>
								);
							})}
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
