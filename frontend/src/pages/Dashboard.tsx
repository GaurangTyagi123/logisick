import Navbar from "@/components/Navbar";
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { Large, Muted } from "@/components/ui/Typography";
import { Link, Outlet, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import useCheckAuth from "@/hooks/user/useCheckAuth";
import { Separator } from "@/components/ui/separator";

/**
 * @component component for sidebar of dashboard page
 * @author `Gaurang Tyagi`
 */
function CustomSidebar() {
	const { orgSlug } = useParams();
	const [pathName, setPathName] = useState("overview");
	const { user: userData } = useCheckAuth();
	const user = userData?.user;

	// sidebar tabs information
	let sidebarData = useMemo(() => {
		return [
			{ name: "Overview", href: `/dashboard/${orgSlug}`, id: "overview" },
			{
				name: "Analytics &  Reporting",
				href: `/dashboard/${orgSlug}/analytics`,
				id: "analytics",
			},
			{
				name: "User & Role",
				href: `/dashboard/${orgSlug}/user-role`,
				id: "user-role",
			},
			{
				name: "Product Management",
				href: `/dashboard/${orgSlug}/product-management`,
				id: "product-management",
			},
			{
				name: "Order & Sales",
				href: `/dashboard/${orgSlug}/order-sales`,
				id: "order-sales",
			},
		];
	}, [orgSlug]);

	if (user?._id === user?.myOrg?.admin)
		sidebarData = sidebarData.filter((data) =>
			["overview", "user-role"].includes(data.id)
		);

	return (
		<Sidebar className="h-full">
			<SidebarHeader>
				<div className="h-16 p-2 flex gap-2 items-center rounded-2xl bg-zinc-300 dark:bg-zinc-800">
					<img
						src="/assets/appicon.png"
						alt="logo"
						className="h-12"
					/>
					<div className="grid gap-1 pt-2">
						<Large className="leading-4 king-julian">
							Logisick
						</Large>
						<Muted className="">logistics solution</Muted>
					</div>
				</div>
			</SidebarHeader>
			<SidebarContent className="dark:bg-ls-bg-dark-800">
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/"
										replace={true}
										className="jet-brains"
									>
										Homepage
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
							<SidebarMenuItem>
								<SidebarMenuButton asChild>
									<Link
										to="/dashboard"
										replace={true}
										className="jet-brains"
									>
										Dashboard
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<Separator/>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarData.map((item, index) => {
								return (
									<SidebarMenuItem key={index}>
										<SidebarMenuButton asChild>
											<Link
												to={item.href}
												replace={true}
												onClick={() =>
													setPathName(item.id)
												}
												className={
													item.id === pathName
														? `jet-brains bg-ls-bg-300 dark:bg-ls-bg-dark-600`
														: `jet-brains `
												}
											>
												{item.name}
											</Link>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	);
}

/**
 * @component page to server as endpoint for dashboard page
 * @author `Gaurang Tyagi`
 */
function Dashboard() {
	return (
		<div className="relative">
			<SidebarProvider>
				<CustomSidebar />
				<main className="flex-1 p-2 min-h-dvh bg-ls-bg-200 dark:bg-ls-bg-dark-900 w-full">
					{/* dashbard navbar */}
					<div className="flex gap-2 items-center">
						<SidebarTrigger
							className="p-2 h-10 w-10 rounded-lg md:rounded-xl"
							variant={"outline"}
						/>
						<Navbar hide={{ logo: true }} />
					</div>
					{/* dashboard main content */}
					<div className="p-1 md:p-3 w-full grid bg-ls-bg-300 dark:bg-ls-bg-dark-800 rounded-2xl">
						<Outlet />
					</div>
				</main>
			</SidebarProvider>
		</div>
	);
}

export default Dashboard;
