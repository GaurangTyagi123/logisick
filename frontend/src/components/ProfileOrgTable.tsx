import { Shield } from "@/assets/icons/Profilepage";
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
import { H3 } from "./ui/Typography";
import Button from "./ui/button";
import { Link } from "react-router-dom";

type OrgType = {
	id: number;
	name: string;
	role: "Admin" | "Manager" | "Staff";
	subscription: "None" | "Basic" | "Pro";
	members: number;
	status: "Active" | "Deactivated";
};

const organizations: OrgType[] = [
	  {
	    id: 1,
	    name: "TechCorp Solutions",
	    role: "Admin",
	    subscription: "Pro",
	    members: 150,
	    status: "Active",
	  },
	  {
	    id: 2,
	    name: "StartupHub",
	    role: "Staff",
	    subscription: "Basic",
	    members: 25,
	    status: "Active",
	  },
	  {
	    id: 3,
	    name: "Innovation Labs",
	    role: "Admin",
	    subscription: "None",
	    members: 8,
	    status: "Deactivated",
	  },
	  {
	    id: 4,
	    name: "Digital Agency Co",
	    role: "Manager",
	    subscription: "Basic",
	    members: 45,
	    status: "Active",
	  },
];

/**
 * @objective function to give different classes based on subscription type
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

/**
 * @objective function to give different clasees based on status type
 * @param status type of status of organization 
 * @returns string of tailwind classes
 */
const getStatusColor = (status: OrgType["status"]) => {
	switch (status) {
		case "Active":
			return "bg-primary/10 text-primary border-primary/20";
		case "Deactivated":
			return "border-1 border-zinc-400 dark:border-zinc-500 bg-zinc-400 dark:bg-zinc-800";
		default:
			return "bg-muted text-muted-foreground";
	}
};

/**
 * @component a table component to display organizations a users is included in along wiht other info of organization
 * @returns react component
 */
function ProfileOrgTable() {
	return (
		<div className="col-span-1 md:col-span-4">
			<Card className="bg-zinc-300 dark:bg-zinc-800 h-full">
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Shield className="h-5 w-5" />
						Organizations
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Table>
						{organizations.length === 0 ? (
							<div className="h-full w-full grid place-items-center gap-3">
								<H3>You are not in any organizations.</H3>
                                <Button asChild>
                                    <Link to={"/default/dashboard"}>
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
										<TableHead>Status</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{organizations.map((org) => (
										<TableRow
											key={org.id}
											className="hover:bg-muted/50"
										>
											<TableCell className="font-medium">
												{org.name}
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className="font-medium"
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
											<TableCell className="text-muted-foreground">
												{org.members} members
											</TableCell>
											<TableCell>
												<Badge
													variant="outline"
													className={getStatusColor(
														org.status
													)}
												>
													{org.status}
												</Badge>
											</TableCell>
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
