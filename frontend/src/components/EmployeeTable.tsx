import { Shield } from "@/assets/icons/Profilepage";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "./ui/table";
import UserAvatar from "./UserAvatar";
import useGetEmployees from "@/hooks/useGetEmployees";
import Loading from "./Loading";
import { toast } from "react-toastify";

function EmployeeTable({ orgid }: { orgid: string }) {
	const {
		data: employees,
		isPending: isGettingEmployees,
		error,
	} = useGetEmployees(orgid as string);
	if (isGettingEmployees) return <Loading />;
	if (error) {
		toast.error(error.message);
		return;
	}
	return (
		<div className="flex md:flex-row flex-col justify-center gap-5 items-center h-full w-full">
			<Card className="bg-white dark:bg-ls-bg-dark-800 h-auto w-screen">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Employees
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table className="outline-1">
						<TableHeader>
							<TableRow>
								<TableHead>Name</TableHead>
								<TableHead>email</TableHead>
								<TableHead>role</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{employees?.map((employee: Emp) => {
								return (
									<TableRow key={employee._id}>
										<TableCell className="font-medium flex gap-5 ml-2">
											<UserAvatar
												customSeed={
													employee.user.avatar ||
													employee.user.email
												}
												className="w-10 h-10 "
											/>
											<span>{employee.user.name}</span>
										</TableCell>
										<TableCell className="font-medium">
											{employee.user.email}
										</TableCell>
										<TableCell className="font-medium">
											{employee.role}
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

export default EmployeeTable;
