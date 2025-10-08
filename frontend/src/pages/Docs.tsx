import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import logo from "@/assets/appicon.png";
import { H2, H3, Large, Muted } from "@/components/ui/Typography";
import Navbar from "@/components/Navbar";
import DocSec from "@/components/DocSec";
import Button from "@/components/ui/button";
import { Link } from "react-router";

interface TabItem {
	label: string;
	link: string;
}

interface Tabs {
	[key: string]: TabItem[];
}

/**
 * @information tabs for sidebar and heading of documents
 */
const tabs: Tabs = {
	"User Guide": [
		{ label: "Getting Started", link: "#ug-getting-started" },
		{ label: "Dashboard", link: "#ug-dashboard" },
		{ label: "Reports", link: "#ug-reports" },
	],
	FAQs: [
		{ label: "General", link: "#faq-general" },
		{ label: "Most Asked", link: "#faq-most-asked" },
	],
	Features: [
		{ label: "F1", link: "#feat-f1" },
		{ label: "F2", link: "#feat-f2" },
		{ label: "F3", link: "#feat-f3" },
		{ label: "F4", link: "#feat-f4" },
		{ label: "F5", link: "#feat-f5" },
	],
};

/**
 * @component a custom sidebar component for documentation page
 * @returns sidebar component
 */
function CustomSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="h-16 p-2 flex gap-2 items-center rounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
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
				{Object.keys(tabs).map((val, i) => {
					return (
						<SidebarGroup key={i}>
							<SidebarGroupLabel className="king-julian">
								{val}
							</SidebarGroupLabel>
							<SidebarGroupContent>
								<SidebarMenu>
									{tabs[val].map((value, j) => {
										return (
											<SidebarMenuItem key={j}>
												<SidebarMenuButton asChild>
													<a
														href={value.link}
														className="jet-brains"
													>
														{value.label}
													</a>
												</SidebarMenuButton>
											</SidebarMenuItem>
										);
									})}
								</SidebarMenu>
							</SidebarGroupContent>
						</SidebarGroup>
					);
				})}
			</SidebarContent>
		</Sidebar>
	);
}

/**
 * @component a page to be used as documentation page of app
 * @returns page/react component
 */
function Docs() {
	return (
		<SidebarProvider>
			<CustomSidebar />
			<main className="p-2 w-full h-screen bg-ls-bg-200 dark:bg-ls-bg-dark-900">
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
				<div className="p-4 king-julian h-11/12 overflow-y-auto">
					<div>
						<H2>User Guide</H2>
						<DocSec id="ug-getting-started">
							<H3>Getting Started</H3>
						</DocSec>
						<DocSec id="ug-dashboard">
							<H3>Dashboard</H3>
						</DocSec>
						<DocSec id="ug-reports">
							<H3>Reports</H3>
						</DocSec>
					</div>
					<div>
						<H2>FAQ</H2>
						<DocSec id="faq-general">
							<H3>General</H3>
						</DocSec>
						<DocSec id="faq-most-asked">
							<H3>Most Asked</H3>
						</DocSec>
					</div>
					<div>
						<H2>Feature</H2>
						<DocSec id="feat-f1">
							<H3>Feature-1</H3>
						</DocSec>
						<DocSec id="feat-f2">
							<H3>Feature-2</H3>
						</DocSec>
						<DocSec id="feat-f3">
							<H3>Feature-3</H3>
						</DocSec>
						<DocSec id="feat-f4">
							<H3>Feature-4</H3>
						</DocSec>
						<DocSec id="feat-f5">
							<H3>Feature-5</H3>
						</DocSec>
					</div>
				</div>
			</main>
		</SidebarProvider>
	);
}

export default Docs;
