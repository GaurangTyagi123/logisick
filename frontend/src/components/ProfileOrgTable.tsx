import {
	Delete,
	Edit,
	Setting,
	Shield,
	Transfer,
} from "@/assets/icons/Profilepage";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { H3, Small } from "./ui/Typography";
import Button from "./ui/button";
import { Link } from "react-router-dom";
import useGetOrganizations from "@/hooks/useGetOrganizations";
import clsx from "clsx";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type OrgType = {
	id: number;
	name: string;
	role: "Admin" | "Manager" | "Staff";
	subscription: "None" | "Basic" | "Pro";
	totalEmployees: number;
	status: "Active" | "Deactivated";
};

/**
 * @brief function to give different classes based on subscription type
 * @param subscription type of subscription of organization
 * @returns string of tailwind classes
 */
const getSubscriptionColor = (subscription: OrgType["subscription"]) => {
	switch (subscription) {
		case "Pro":
			return "bg-violet-600 dark:bg-violet-500 text-primary-foreground";
		case "Basic":
			return "bg-yellow-600 dark:bg-yellow-500 text-primary-foreground";
		case "None":
			return "bg-secondary text-secondary-foreground";
		default:
			return "bg-muted text-muted-foreground";
	}
};

function roleClasses(role: string): string {
	switch (role) {
		case "Owner":
			return "text-black bg-yellow-400 dark:text-black dark:bg-yellow-400";
		case "Admin":
			return "text-black bg-violet-400 dark:text-black dark:bg-violet-400";
		case "Manager":
			return "text-black bg-green-400 dark:text-black dark:bg-green-400";
		case "Staff":
			return "text-white bg-zinc-800 dark:text-black dark:bg-zinc-200";
		default:
			return "text-black bg-zinc-300 outline-1 dark:text-white dark:bg-zinc-800 ";
	}
}



/**
 * @component a table component to display organizations a users is included in along wiht other info of organization
 * @returns react component
 */
function ProfileOrgTable({
    setDeleteOpen,
    setEditOpen,
    setOpenTransfer
}: {
    setDeleteOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setOpenTransfer: React.Dispatch<React.SetStateAction<boolean>>;
}) {
	const { data: organizations, isPending } = useGetOrganizations();

	return (
		<div className="col-span-1 md:col-span-4">
			<Card className="bg-white dark:bg-ls-bg-dark-800 h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Organizations
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						{!organizations || isPending ? (
							<div className="h-full w-full grid place-items-center gap-3">
								<H3>You are not in any organizations.</H3>
								<Button asChild>
									<Link to={"/dashboard"}>
										Create/Join a Organization
									</Link>
								</Button>
							</div>
						) : (
							<>
								<TableHeader>
									<TableRow>
										<TableHead>Organization</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Subscription</TableHead>
										<TableHead>Members</TableHead>
										<TableHead>Type</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{organizations.map((org: Org) => (
										<TableRow
											key={org._id}
											className="hover:bg-muted/50"
										>
											<TableCell className="font-medium">
												{org.name}
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={clsx(
														"font-medium",
														roleClasses("Owner")
													)}
												>
													{org.role}
												</Badge>
											</TableCell>
											<TableCell>
												<Badge
													className={getSubscriptionColor(
														org.subscription
													)}
												>
													{org.subscription}
												</Badge>
											</TableCell>
											<TableCell
												className={
													"text-muted-foreground"
												}
											>
												{org?.totalEmployees ?? 1}{" "}
												members
											</TableCell>
											<TableCell>
												<Badge variant="outline">
													{org.type}
												</Badge>
											</TableCell>
											{org.role.toLowerCase() ===
												"owner" && (
												<TableCell className="w-[5px]">
													<DropdownMenu>
														<DropdownMenuTrigger>
															<Setting className="w-5 h-5 outline rounded-sm cursor-pointer outline-offset-2" />
														</DropdownMenuTrigger>
														<DropdownMenuContent className="font-semibold bg-ls-bg-100 dark:bg-ls-bg-dark-800">
															<DropdownMenuItem
																className="cursor-pointer"
																onClick={() =>
																	setEditOpen(
																		true
																	)
																}
															>
																<Edit />
																EDIT
																organization
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem className="cursor-pointer" onClick={()=>setOpenTransfer(true)}>
																<Transfer />
																TRANSFER
																ownership
															</DropdownMenuItem>
															<DropdownMenuSeparator />
															<DropdownMenuItem
																className="cursor-pointer"
																onClick={() =>
																	setDeleteOpen(
																		true
																	)
																}
															>
																<Delete className="text-red-500" />
																<Small className="text-red-500">
																	DELETE
																	organization
																</Small>
															</DropdownMenuItem>
															<DropdownMenuSeparator />
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											)}
										</TableRow>
									))}
								</TableBody>
							</>
						)}
					</Table>
				</CardContent>
			</Card>
		</div>
	);
}

export default ProfileOrgTable;
