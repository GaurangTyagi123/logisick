import Navbar from "@/components/Navbar"
import logo from "@/assets/appicon.png";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { /*H2 */ /*H3*/ Large, Muted } from "@/components/ui/Typography";
import Button from "@/components/ui/button";
import {  Link, Outlet } from "react-router-dom";
import {useState } from "react";


function CustomSidebar() {
	const sidebarData = [
		{name : "Overview",href:"./",id:"overview"},
		{name : "Analytics &  Reporting",href:"./analytics",id:"analytics"},
		{name : "User & Role",href:"./user-role",id:"user-role"},
		{name : "Product Management",href:"./product-management",id:"product-management"},
		{name : "Order & Sales",href:"./order-sales",id:"order-sales"},
	]
	const [pathName, setPathName] = useState("overview");


	return (
		<Sidebar>
			<SidebarHeader>
				<div className="h-16 p-2 flex gap-2 items-center rounded-2xl bg-zinc-300 dark:bg-zinc-700">
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
			<SidebarContent>
				<SidebarGroup >
							<SidebarGroupContent>
								<SidebarMenu>
							{sidebarData.map(item => {
										return <SidebarMenuItem>
												<SidebarMenuButton asChild>
													<Link
										to={item.href}
													replace={true}
													onClick={()=>setPathName(item.id)}
														className={item.id === pathName ? `jet-brains bg-muted` : `jet-brains `}
													>
													{item.name} 
													</Link>
												</SidebarMenuButton>
											</SidebarMenuItem>
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
	<div>
		  <SidebarProvider>
			<CustomSidebar />
			<main className="p-2 w-full h-screen">
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
				  <div className="p-4 m-5 king-julian h-11/12 overflow-y-auto bg-zinc-300 dark:bg-zinc-900">
					  <Outlet/>
				</div>
			</main>
		</SidebarProvider>
	</div>
  )
}

export default Dashboard
