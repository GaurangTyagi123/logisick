import Navbar from "@/components/Navbar";
import logo from "@/assets/appicon.png";
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
import Button from "@/components/ui/button";
import { Link, Outlet, useParams } from "react-router-dom";
import { useMemo, useState } from "react";

function CustomSidebar() {
	const { orgSlug } = useParams();
	const [pathName, setPathName] = useState("overview");
	const sidebarData = useMemo(() => {
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

	return (
		<Sidebar>
			<SidebarHeader>
				<div className="h-16 p-2 flex gap-2 items-center rounded-2xl bg-zinc-300 dark:bg-zinc-800">
					<img
						src={logo}
						alt="logo"
						className="h-12 drop-shadow-sm drop-shadow-black"
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
function Dashboard() {
	return (
		<div className="">
			<SidebarProvider>
				<CustomSidebar />
				<main className="flex-1 p-2 min-h-dvh bg-ls-bg-200 dark:bg-ls-bg-dark-900 w-64 relative">
					<div className="flex gap-2 items-center">
						<SidebarTrigger
							className="p-2 h-10 w-10 rounded-xl"
							variant={"outline"}
						/>
						<Button variant={"link"} asChild>
							<Link to={"/"}>Go to Homepage</Link>
						</Button>
						<Navbar hide={{ logo: true }} />
					</div>
					<div className="m-2 p-4 flex flex-col bg-ls-bg-300 dark:bg-ls-bg-dark-800 rounded-2xl">
						<Outlet />
					</div>
				</main>
			</SidebarProvider>
		</div>
	);
}

export default Dashboard;
