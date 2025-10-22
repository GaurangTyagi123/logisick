import useGetEmployees from "@/hooks/useGetEmployees";
import Loading from "./Loading";
import { toast } from "react-toastify";
import CustomTable from "./CustomTable";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { searchEmployee } from "@/services/apiOrganization";
import { useMutation } from "@tanstack/react-query";
import { debounce } from 'lodash';
import UserAvatar from "./UserAvatar";

interface Employee{
	[key: string]: string;
	name: string;
	email: string;
	role: string;
	avatar: string;
}

function deconstructEmployee(employees: Array<{
	data: {
		role: string;
		employees: {
		name: string;
		email: string;
		role: string;
		avatar: string;
		}
		count: string;
	}
}>) {
	console.log(employees)
	return employees.map((employee : {data: {
		role: string;
		employees: {
		name: string;
		email: string;
		avatar: string;
		}
		count: string;
	}}) => {
		const newE = { role : employee?.data?.role,...employee?.data?.employees };
		return newE;
	})
}
function EmployeeTable({ orgid }: { orgid: string }) {

	const PAGESIZE = 10;
	const [totalPages,setTotalPages] = useState<number>(1)
	const [page, setPage] = useState<number>(1);

	const {
		data: employees,
		count,
		isPending: isGettingEmployees,
		error,
	} = useGetEmployees(orgid as string,page);

	const [searchResults, setSearchResults] = useState<
		Employee[] | null>(null);
	const { mutate: search } = useMutation({
		mutationFn: searchEmployee,
		onSettled: (data) => {
			if (data) {
				setSearchResults(deconstructEmployee(data.employees.map((d:any)=>({data :d}))))
			}
			else
				return;
		}
	})
	const controllerRef = useRef<AbortController>(null);
	const handleSearch = useCallback(async (query: string) => {
		if (controllerRef.current) {
			controllerRef.current.abort();
		}
		const controller = new AbortController();
		controllerRef.current = controller;
		if(query)
			search({ orgid, query, controller });
	}, [orgid, search])

	const debouncedSearch = useMemo(() => {
		return debounce(handleSearch, 500);
	}, [handleSearch]) as ((searchTerm: string) => void) & { cancel: () => void };


	useEffect(() => {
		if (!isGettingEmployees) {
			setTotalPages(count > PAGESIZE ? Math.ceil(count / PAGESIZE) : 1);
		}
	}, [count, isGettingEmployees])
	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
			controllerRef.current?.abort();
		}
	},[debouncedSearch])
	
	if (isGettingEmployees) return <Loading />;
	if (error) {
		toast.error(error.message);
		return;
	}
	const deconstructedEmployees = deconstructEmployee(employees)
	return (
		<div className=" w-full">
			<CustomTable<Record<string,string>>
				title="Employees"
				columns={[
				{
					key:"name",
						header: "name",
						render: (_, row) => {
							return <div className="flex gap-2 items-center">
								<UserAvatar className="w-10 h-10" customSeed={row.avatar} />
								<span className="hidden sm:flex">{row?.name}</span>
							</div>
					}
				},
				{
					key:"email",
					header : "email"
				},
				{
					key:"role",
					header : "role"
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
