// HOOKS
import useGetEmployees from "@/hooks/emp/useGetEmployees";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { searchEmployee } from "@/services/apiOrg";

// COMPONENTS
import UserAvatar from "@/components/UserAvatar";
import CustomTable from "@/components/CustomTable";

import { toast } from "react-toastify";
import { debounce } from "lodash";
import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";

interface Employee {
	[key: string]: string;
	name: string;
	email: string;
	role: string;
	avatar: string;
}

/**
 * @brief function to deconstruct searched data on employee
 * @param employees list of employee's data
 * @author `Gaurang Tyagi`
 */
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
 * @param {string} orgid id of the organization
 * @author `Gaurang Tyagi`
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
		isGettingEmployees,
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

			if (query.length)
				search({ orgid, query: query.trim(), controller });
		},
		[orgid, search]
	);

	// debounce handle search function
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

	if (isGettingEmployees) return <CustomTableSkeleton />;
	if (error) {
		toast.error(error.message, { className: "toast" });
		return;
	}
	const deconstructedEmployees = deconstructEmployee(employees);
	return (
		<CustomTable
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
								<span className="overflow-hidden text-ellipsis whitespace-nowrap">
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
			onSearch={handleSearchWrapper}
		/>
	);
}

export default EmployeeTable;
