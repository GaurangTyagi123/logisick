import { Grid, List, Plus } from "@/assets/icons/Organizationpage";
import OrganizationModal from "@/components/modals/CreateOrgModal";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { H2, H3, Large, Muted, Small } from "@/components/ui/Typography";
import useGetOrganizations from "@/hooks/organization/useGetOrganizations";
import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { Loader } from "lucide-react";
import { Suspense, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface OrgCardProps {
	org: {
		_id: Org["_id"];
		name: Org["name"];
		description: Org["description"];
		role: "Staff" | "Manager" | "Owner" | "Admin";
		slug: string;
	};
	view: "grid" | "list";
}

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

function OrgCard({ org, view }: OrgCardProps) {
	return (
		<Card className="bg-ls-bg-300 dark:bg-ls-bg-dark-800 hover:border-zinc-500 transition-colors duration-100">
			<CardHeader className="flex items-center">
				<CardTitle className="overflow-hidden text-ellipsis whitespace-nowrap">
					<Large>{org.name}</Large>
				</CardTitle>
				<Badge
					className={clsx(
						roleClasses(""),
						"font-semibold shadow-md ml-auto"
					)}
				>
					{org.role}
				</Badge>
				{view === "list" && (
					<Button asChild variant={"link"}>
						<Link to={`/dashboard/${org?.slug}`}>View</Link>
					</Button>
				)}
			</CardHeader>
			<CardContent>
				<Muted className="line-clamp-2">{org.description}</Muted>
			</CardContent>
			{view === "grid" && (
				<CardFooter className="flex justify-end">
					<Button asChild>
						<Link to={`/dashboard/${org?.slug}`}>View</Link>
					</Button>
				</CardFooter>
			)}
		</Card>
	);
}
/**
 * @component component which displays all the organizations
 * @returns react component
 */
function Organization() {
	const [openOrgForm, setOpenOrgForm] = useState(false);
	const [view, setView] = useState<"grid" | "list">("grid");
	const navigate = useNavigate();

	const queryClient = useQueryClient();
	const userData = queryClient.getQueryData(["user"]) as
		| { user?: User }
		| undefined;
	const user = userData?.user;
	const { data: organizations, isPending } = useGetOrganizations();

	if (!user) navigate("/");
	if (isPending) return <Loader />;

	return (
		<>
			<div className="w-full flex flex-col gap-3 min-h-dvh bg-ls-bg-200 dark:bg-ls-bg-dark-900 relative">
				<Navbar />
				<div className="flex flex-col sm:flex-row justify-between items-center king-julian md:px-4 gap-2 px-2">
					<H2>Organizations</H2>
					<div className="flex gap-2 justify-between w-full sm:w-fit sm:justify-center">
						{/* view toggle */}
						<div className="flex">
							<Button
								variant={
									view === "grid" ? "default" : "outline"
								}
								className="ml-auto rounded-r-none"
								onClick={() => setView("grid")}
								title="grid view"
							>
								<Grid />
							</Button>
							<Button
								variant={
									view === "list" ? "default" : "outline"
								}
								className="rounded-l-none"
								onClick={() => setView("list")}
								title="list view"
							>
								<List />
							</Button>
						</div>
						{/* new org button */}
						<Button
							size="lg"
							className="top-10 right-20 w-fit"
							onClick={() => setOpenOrgForm(true)}
						>
							<Small>Add new Org</Small>
							<Plus />
						</Button>
					</div>
				</div>
				{/* orgs display */}
				<div
					className={clsx(
						"min-h-96 m-4 items-baseline outline-1 p-4 rounded-2xl grid gap-2 ",
						view === "grid"
							? `grid-cols-[repeat(auto-fit,minmax(320px,1fr))]`
							: ""
					)}
				>
					{organizations.length === 0 ? (
						<div className="h-full w-full flex flex-col justify-center items-center gap-3">
							<H3>You are not in any organizations.</H3>
							<Button onClick={() => setOpenOrgForm(true)}>
								Create/Join a Organization
							</Button>
						</div>
					) : (
						organizations.map((orgData: Org) => (
							<OrgCard
								org={orgData}
								key={orgData._id}
								view={view}
							/>
						))
					)}
				</div>

				{/* modal to create new org */}
				<Suspense>
					<OrganizationModal
						open={openOrgForm}
						setOpen={setOpenOrgForm}
					/>
				</Suspense>
			</div>
		</>
	);
}

export default Organization;
