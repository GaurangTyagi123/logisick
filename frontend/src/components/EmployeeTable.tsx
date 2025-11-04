// HOOKS
import useGetEmployees from "@/hooks/useGetEmployees";
import { lazy, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { searchEmployee } from "@/services/apiOrg";

// COMPONENTS
const Loading = lazy(() => import("./Loading"));
import UserAvatar from "./UserAvatar";
import CustomTable from "./CustomTable";

import { toast } from "react-toastify";
import { debounce } from "lodash";

interface Employee {
	[key: string]: string;
	name: string;
	email: string;
	role: string;
	avatar: string;
}

// unwinds employee data
function deconstructEmployee(
	employees: Array<{
		data: {
			role: string;
			employees: {
				name: string;
				email: string;
				role: string;
				avatar: string;
			};
			count: string;
		};
	}>
) {
	return (
		employees?.map(
			(employee: {
				data: {
					role: string;
					employees: {
						name: string;
						email: string;
						avatar: string;
					};
					count: string;
				};
			}) => {
				const newE = {
					role: employee?.data?.role,
					...employee?.data?.employees,
				};
				return newE;
			}
		) || []
	);
}
/**
 * @component Employee table displays all the employees belonging to an organization including the owner
 * @param orgid (string) id of the organization
 * @returns JSX
 */
function EmployeeTable({ orgid }: { orgid: string }) {
	/**
	 * @method if there is no search query then display data recieved from the server (employees)
	 * else send the query to the server and store the result in searchResults after deconstructing
	 */
	// size of each page in the table
	const PAGESIZE = 5;

	// total number of pages in the table
	const [totalPages, setTotalPages] = useState<number>(1);

	// current page
	const [page, setPage] = useState<number>(1);

	// employee data
	const {
		data: employees,
		count,
		isPending: isGettingEmployees,
		error,
	} = useGetEmployees(orgid as string, page);

	// stores the search results
	const [searchResults, setSearchResults] = useState<Employee[] | null>(null);

	// handles the search query request
	const { mutate: search } = useMutation({
		mutationFn: searchEmployee,
		onSettled: (data) => {
			if (data) {
				setSearchResults(
					deconstructEmployee(
						data.employees.map((d: any) => ({ data: d }))
					)
				);
			} else return;
		},
	});

	// stores reference to search request controller
	const controllerRef = useRef<AbortController>(null);

	// handles search query in the table
	const handleSearch = useCallback(
		async (query: string) => {
			if (controllerRef.current) {
				controllerRef.current.abort();
			}
			const controller = new AbortController();
			controllerRef.current = controller;
			if (query.trim().length) search({ orgid, query, controller });
		},
		[orgid, search]
	);

	// debounce handle search function
	const debouncedSearch = useMemo(() => {
		return debounce(handleSearch, 500);
	}, [handleSearch]) as ((searchTerm: string) => void) & {
		cancel: () => void;
	};

	// calculates and sets the totalPage number based on the employee data recieved from the server
	useEffect(() => {
		if (!isGettingEmployees) {
			setTotalPages(count > PAGESIZE ? Math.ceil(count / PAGESIZE) : 1);
		}
	}, [count, isGettingEmployees]);

	// aborts incomplete search requests
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
			controllerRef.current?.abort();
		};
	}, [debouncedSearch]);

	if (isGettingEmployees) return <Loading />;
	if (error) {
		toast.error(error.message, { className: "toast" });
		return;
	}
	const deconstructedEmployees = deconstructEmployee(employees);
	return (
		<div className=" w-full">
			<CustomTable<Record<string, string>>
				title="Employees"
				columns={[
					{
						key: "name",
						header: "Name",
						render: (_, row) => {
							return (
								<div className="flex gap-2 items-center">
									<UserAvatar
										className="w-10 h-10"
										customSeed={row.avatar}
									/>
									<span className="hidden sm:flex">
										{row?.name}
									</span>
								</div>
							);
						},
					},
					{
						key: "email",
						header: "Email",
					},
					{
						key: "role",
						header: "Role",
					},
				]}
				clientSide
				data={searchResults ? searchResults : deconstructedEmployees}
				currentPage={page}
				totalPages={totalPages}
				setPage={setPage}
				onSearch={debouncedSearch}
			/>
		</div>
	);
}

export default EmployeeTable;
