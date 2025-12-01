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
import { H2, H3, H4, Large, Muted, P } from "@/components/ui/Typography";
import Navbar from "@/components/Navbar";
import DocSec from "@/components/DocSec";
import Button from "@/components/ui/button";
import { Link } from "react-router";
import useModeStore from "@/stores/useModeStore";

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
		// { label: "Reports", link: "#ug-reports" },
	],
	Features: [
		{ label: "Inventory", link: "#feat-f1" },
		{ label: "Sales & Orders", link: "#feat-f2" },
		{ label: "Reports & Analytics", link: "#feat-f3" },
		{ label: "Employees & Roles", link: "#feat-f4" },
	],
	"Developer's Section": [
		{ label: "API Documentation", link: "https://documenter.getpostman.com/view/47791845/2sB3BLjnwi" }
	]
};

/**
 * @component sidebar for docs page
 * @author `Manas More`
 */
function CustomSidebar() {
	return (
		<Sidebar>
			<SidebarHeader>
				<div className="h-16 p-2 flex gap-2 items-center rounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
					<img
						src="/assets/appicon.png"
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
 * @component page to server as endpoint for docs page
 * @author `Ravish Ranjan`
 */
function Docs() {
	const { mode } = useModeStore();
	return (
		<SidebarProvider>
			<CustomSidebar />
			<main className="p-1 w-full h-screen bg-ls-bg-200 dark:bg-ls-bg-dark-900">
				<div className="flex gap-2 items-center">
					<SidebarTrigger
						className="p-1 h-10 w-10 rounded-xl"
						variant={"outline"}
					/>
					<Button variant={"link"} asChild>
						<Link to={"/"}>Homepage</Link>
					</Button>
					<Navbar hide={{ logo: true }} />
				</div>
				<div className="p-1 h-11/12 overflow-y-auto grid gap-10">
					<div className="grid gap-3 my-5 mx-2">
						<H2>User Guide</H2>
						<P className="jet-brains">
							Welcome! This guide will walk you
							step-by-step through creating your first
							account, logging in, and locating your
							user profile. By the end, you'll be
							fully set up and ready to go.
						</P>
						<DocSec id="ug-getting-started" title="Getting Started">
							<div id="ug-getting-started-authenticate">
								<Large>
									&rarr; Creating Your Account and Finding Your
									Profile
								</Large>
								<article className="docs-content">
									{/* <H4>
										Creating Your Account and Finding Your
										Profile
									</H4> */}
									{/* <P>Let's get started.</P> */}

									<H4>
										Part 1: Creating Your Account
										(Registration)
									</H4>

									<ol className="list-decimal px-10 space-y-4">
										<li>
											<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_authen_button.webp" : "/assets/gettingStarted/light/light_authen_button.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
											Navigate to the{" "}
											<strong>"Sign Up"</strong> or{" "}
											<strong>"Register"</strong> page.
										</li>
										<li>
											You will see two ways to sign up.
											Choose the one that's best for you.
										</li>
									</ol>

									<H4>
										Option A: Register with Email (The
										Classic Way)
									</H4>
									<P>
										This is the best option if you want to
										use a specific name and password.
									</P>
									<ol className="list-decimal px-10 space-y-4">
										<li>
											Find the registration form on the
											page.
										</li>
										<li>
											Fill in your <strong>Name</strong>{" "}
											(e.g., "Jane Doe").
										</li>
										<li>
											Fill in your <strong>Email</strong>{" "}
											(e.g., "jane.doe@example.com").
										</li>
										<li>
											Create a secure{" "}
											<strong>Password</strong>.
										</li>
										<li>
											Click the{" "}
											<strong>"Register"</strong> button.
										</li>
										<li>
											You may need to check your email
											<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_register_email.webp" : "/assets/gettingStarted/light/light_register_email.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
											inbox for a verification link to
											confirm your account.
										</li>

									</ol>

									<H4>
										Option B: Register with Google (The
										Quick Way)
									</H4>
									<P>
										This is the fastest way to get started.
									</P>
									<ol className="list-decimal px-10 space-y-4">
										<li>
											Look for the button that says{" "}
											<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_register_google.webp" : "/assets/gettingStarted/light/light_register_google.webp"} className="h-64 w-128 my-4 object-contain rounded-2xl" loading="lazy" />
											<strong>
												"Sign up with Google"
											</strong>
										</li>
										<li>
											<img src="/assets/gettingStarted/dark/dark_google_sign.webp" className="h-64 my-4 object-contain rounded-2xl" loading="lazy" />
											Click it. A new pop-up window will
											appear, asking you to choose your
											Google account.
										</li>
										<li>
											Select the Google account you wish
											to use.
										</li>
										<li>
											Follow the prompts from Google to
											grant permission.
										</li>
										<li>
											That's it! Your account will be
											created and you'll be automatically
											logged in.
										</li>
									</ol>
									<hr className="dark:border-gray-100 border-gray-700 my-5" />
									<H4>
										Part 2: Logging In (After You're
										Registered)
									</H4>
									<P>
										Once your account is created, here is
										how you log in for future visits:
									</P>
									<ol className="list-decimal px-10 space-y-4">
										<li>
											Navigate to the{" "}
											<strong>"Login"</strong> or{" "}
											<strong>"Sign In"</strong> page.
										</li>
										<li>
											<strong>
												If you registered with email:
												<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_login.webp" : "/assets/gettingStarted/light/light_login.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
											</strong>{" "}
											Enter the email and password you
											created in Part 1 and click "Login."
										</li>
										<li>
											<strong>
												If you registered with Google:
											</strong>{" "}
											Simply click the{" "}
											<strong>
												"Sign in with Google"
											</strong>{" "}
											button.
										</li>
									</ol>
									<hr className="dark:border-gray-100 border-gray-700 my-5" />
									<H4>Part 3: Finding Your Profile Page</H4>

									<P>
										Great, you're logged in! Now let's find
										your profile, where you can manage your
										settings. There are two easy ways to get
										there.
									</P>

									<H4>
										Method 1: Using the Navigation Bar
										(Recommended)
									</H4>
									<P>
										This is the easiest way to find your
										profile.
									</P>
									<ol className="list-decimal px-10">
										<li>
											Look at the main navigation bar
											(usually at the top of the page).
										</li>
										<li>
											<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_profile_button.webp" : "/assets/gettingStarted/light/light_profile_button.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
											Find the{" "}
											<strong>User Button</strong>. This
											might show your name, your initials,
											or a profile icon.
										</li>
										<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_dropdown.webp" : "/assets/gettingStarted/light/light_dropdown.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
										<li>
											Click on this button. A dropdown
											menu will appear.

										</li>
										<li>
											From the menu, click on the{" "}
											<strong>"Profile"</strong> option.
										</li>
									</ol>

									<H4>Method 2: Using the Direct URL</H4>
									<P>
										You can also go directly to the profile
										page at any time &rarr;
									</P>
									<ol>
										<li className="mt-4">
											Click on your browser's address bar.
										</li>
										<li>
											<b>Type</b> <code>
												https://logisick.onrender.com/profile
											</code>
										</li>
										<li>
											Press <strong>Enter</strong>.
										</li>
									</ol>

									<H4>Congratulations!</H4>

									<P>
										<img src={mode !== "light" ? "/assets/gettingStarted/dark/dark_profile.webp" : "/assets/gettingStarted/light/light_profile.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
										You've successfully created an account,
										learned how to log in, and found your
										profile page. You're all set!


									</P>
								</article>
							</div>
						</DocSec>
						<DocSec id="ug-dashboard" title="Dashboard">
							<div>
								<article className="docs-content">
									<H3>
										&rarr; Creating Your Organization
									</H3>
									<ol className="list-decimal px-10 space-y-4">
										<li>
											Navigate to the{" "}
											<strong>"Your organizations"</strong>  page.
											<img src={mode !== "light" ? "/assets/dashboard/dark/dark_organization_dropdown.webp" : "/assets/dashboard/light/light_organization_dropdown.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />
										</li>
										<li>
											Find the <strong>"Add New Organization"</strong> button.
											<img src={mode !== "light" ? "/assets/dashboard/dark/dark_add_org.webp" : "/assets/dashboard/light/light_add_org.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />

										</li>
										<li>
											Click on this button. This will open a modal.
											<img src={mode !== "light" ? "/assets/dashboard/dark/dark_modal.webp" : "/assets/dashboard/light/light_modal.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />

										</li>
										<li>
											Fill in your organization's name .
										</li>
										<li>
											Give a brief description of your organization .
										</li>
										<li>
											Select the size of your organization (e.g. small-cap, mid-cap, large-cap etc.).
										</li>
										<li>
											Then click on submit to register your organization.
											<img src={mode !== "light" ? "/assets/dashboard/dark/dark_submit.webp" : "/assets/dashboard/light/light_submit.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />

										</li>
									</ol>
									<hr className="dark:border-gray-100 border-gray-700 my-5" />
									<H3>
										&rarr; Accessing Your Organization's Workspace
									</H3>
									<P className="my-3">
										Once your organization is registered, here is
										what you can do to access your workspace:
									</P>
									<ol className="list-decimal px-10 space-y-4">
										<li>
											Navigate to the{" "}
											<strong>"Your organization"</strong> page by clicking on
										</li>
										<li>
											This will take you to the dashboard page where you can see all your organizations.
										</li>
										<li>
											Click on <strong>"View Organization"</strong> to access <strong>"Organization Workspace"</strong>
										</li>
										<img src={mode !== "light" ? "/assets/dashboard/dark/dark_dashboard.webp" : "/assets/dashboard/light/light_dashboard.webp"} className="h-64 object-contain my-4 rounded-2xl" loading="lazy" />

									</ol>
								</article>
							</div>
						</DocSec>
					</div>
					<div className="space-y-5">
						<H2 className="my-4">features</H2>

						<DocSec id="feat-f1" title="Inventory" >
							<div>
								<P className="jet-brains">
									The Inventory Management module allows you to store, track, and manage all the items in your organization. This section provides a detailed overview of each feature, helping you maintain accurate stock records, pricing information, and item-level insights.
								</P>
								<H4>
									&rarr; Items Summary Dashboard
								</H4>
								<P className="my-5">
									At the top of the page, you&apos;ll find a set of summary cards that give you quick insights into your stock:
								</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>Metric	Description</li>
									<li>Total number of products currently in your inventory.</li>
									<li>Combined quantity of all items.</li>
									<li>Average stock level for each product.</li>
									<li>Total investment made in acquiring the current stock.</li>
									<li>
										Total value if all items are sold at their selling price.
									</li>
									<li>Average Cost / Selling Price	Price averages that help in pricing strategy and profitability tracking.</li>

								</ol>
								<P className="m	y-5">
									These metrics help you understand your inventory worth and stock distribution instantly.
								</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />
							</div>

							<div>
								<H4>
									&rarr; Items List Table
								</H4>
								<P className="my-5">
									The core part of the page shows a tabular view of all items. Each row contains:
								</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>Item Name</li>

									<li>Imported Date (when the stock was added)</li>

									<li>Expiry Date (if applicable)</li>

									<li>Category (Dairy, Stationery, Food, etc.)</li>

									<li>Batch Number (optional identification)</li>

									<li>Unit Weight (with measurement units like kg, g, mg, etc.)</li>

									<li>Quantity in Stock</li>

									<li>Cost Price (purchase price per unit)</li>

									<li>Selling Price (selling value per unit)</li>

								</ol>
								<P className="m	y-5">
									This list supports visual price indicators — cost prices appear in red, while selling prices are shown in green, helping you spot profitable items at a glance.
								</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; Search & Sort
								</H4>
								<P className="my-5">
									To efficiently manage small - medium sized inventories
								</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>Search by item name</li>

									<li>Sort using different parameters such as price, name, date or category</li>

									<li>Filter / Clear results using quick actions</li>


								</ol>
								<P className="m	y-5">
									This ensures you always find what you need within seconds.
								</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; Add New Item
								</H4>
								<P className="my-5">
									Click "Add New Item" to insert a new product into your inventory. The form allows you to define:
								</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>Item Name</li>

									<li>Category</li>

									<li>Unit weight with size & unit</li>
									<li>Cost and selling price</li>
									<li>Batch number</li>
									<li>Quantity</li>
									<li>Expiry Date</li>
								</ol>
								<P className="m	y-5">
									Once saved, the item becomes part of your inventory and can be tracked and managed later.
								</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; Manage Existing Items
								</H4>
								<P className="my-5">
									Each product row contains a Manage / Edit button that lets you:
								</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>Update item details</li>

									<li>Correct quantities</li>

									<li>Adjust pricing</li>
									<li>Mark expired or discontinued stock</li>
									<li>Delete the item</li>
								</ol>
								<P className="m	y-5">
									This keeps your inventory accurate and upto date.
								</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; Create Order from item
								</H4>
								<P className="my-5">
									If an item needs to be added directly into an order, simply click "Create Order" next to it. This saves time by pre-selecting the item when creating customer orders.
								</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; QR Code View
								</H4>
								<P className="my-5">
									Click on manage item.
									This section allows you to quickly share or verify item details by scanning a QR code instead of manually searching for the product.
								</P>
								<ol className="list-decimal px-10 space-y-4">
									<li><strong>QR Code Display</strong> – Represents a unique, secure link to the item. Anyone with access can scan and retrieve item information instantly.</li>
									<li><strong>Show Information</strong> – Opens the item details view, including expiry status, pricing, and metadata.</li>
									<li><strong>Edit Item Data</strong> – Opens the item editor with all existing fields pre-filled so you can modify details.</li>
									<li><strong>Delete Data</strong> – Permanently removes the item from your database. This action cannot be undone.</li>
									<li><strong>Go Back</strong> – Returns to the previous page or Product list.</li>
								</ol>
							</div>
						</DocSec>
						<DocSec id="feat-f2" title="Sales & Orders">
							<P className="jet-brains">
								This page lists all recorded orders along with their quantities, dates, shipment statuses, and available management actions. Whether you're processing new sales or updating existing orders, this section acts as the centralized control panel for your sales workflow.
							</P>
							<div>
								<H4>
									&rarr; Orders Summary
								</H4>
								<P>The main table provides detailed insights into each order:</P>
								<dl className="px-10 space-y-4">
									<dt><strong>No. of Orders</strong></dt>
									<dd>Total number of orders placed.</dd>

									<dt><strong>Total Quantity</strong></dt>
									<dd>Combined quantity of items sold across all orders.</dd>

									<dt><strong>Total Value</strong></dt>
									<dd>Cumulative selling price of all processed orders.</dd>
								</dl>
								<P>Each record allows you to quickly determine what needs attention and take action instantly.</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />
							</div>
							<div>
								<H4>
									&rarr; Search & Filter
								</H4>
								<P>Use the search box to locate orders by name or ID. Sorting options allow you to reorder the list based on different parameters, making navigation effortless even with large order histories.</P>

								<hr className="dark:border-gray-100 border-gray-700 my-5" />
							</div>
							<div>
								<H4>
									&rarr; Shipment Status Tracking
								</H4>
								<P>Each order displays a shipment status badge such as:</P>
								<ul>
									<li>Under Process</li>
									<li>Dispatched</li>
									<li>Delivered</li>
									<li>Cancelled</li>
								</ul>
								<P>You can update this status at any stage to reflect the order's lifecycle, providing real-time visibility to your team.</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />
							</div>
							<div>
								<H4>
									&rarr; Manage Order Actions
								</H4>
								<P>Each order row includes two actionable buttons:</P>
								<dl className="px-10 space-y-4">
									<dt><strong>Update</strong></dt>
									<dd>Modify the order details, update shipment status, or adjust item quantities as required.</dd> <dt><strong>Delete</strong></dt>
									<dd>Remove the order from the records permanently. This action cannot be undone and should be used with caution.</dd>
								</dl>
							</div>
						</DocSec>
						<DocSec id="feat-f3" title="Reports & Analytics">
							<P>
                                The <strong>Analytics</strong> section provides a real-time,
                                high-level overview of inventory performance and
                                sales activity, enabling users to quickly gauge
                                business health. This page is segmented into two
                                main components. The <strong>Items Summary</strong> panel
                                offers key inventory metrics, including the
                                total count of distinct items (e.g., 4) and
                                total quantity across all items (e.g., 6), along
                                with calculated efficiency metrics like Average
                                Quantity per Item (e.g., 1.5). It also tracks
                                financial data related to inventory, displaying
                                the Total Cost Price, Total Selling Price, and
                                their corresponding Average Cost Price and
                                Average Selling Price for deeper profit margin
                                analysis. Below this, the <strong>Orders Summary</strong>
                                panel provides a concise snapshot of transaction
                                volume, showing the total No. of Orders (e.g.,
                                5), the collective Total Quantity of items sold
                                across these orders (e.g., 5), and the
                                cumulative Total Value (e.g., ₹208,788.00)
                                generated from all processed transactions.
                            </P>
						</DocSec>
						<DocSec id="feat-f4" title="Employees & Roles">
							<P className="jet-brains">
								The User & Role Management section allows organization owners and administrators to control who can access the system and what actions they are permitted to perform. This page provides a centralized interface to invite employees, assign roles, and manage user access levels securely and efficiently.
							</P>
							<div>
								<H4>
									&rarr; Employee list
								</H4>
								<P>A structured list of all registered employees along with:</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>Profile Avatar</li>
									<li>Full Name</li>
									<li>Unique username</li>
									<li>Assigned Role</li>
									<li>Email</li>
								</ol>
								<P>Users are visually separated, making it easy to identify who holds which responsibilities.</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />
							</div>
							<div>
								<H4>
									&rarr; Invite Employee
								</H4>
								<P>The Invite Employee button allows you to onboard new members. When clicked, you'll be prompted to enter the employee's email address. Once invited:</P>
								<ol className="list-decimal px-10 space-y-4">
									<li>A unique link is sent to their email</li>
									<li>They join the organization upon account creation</li>
								</ol>
								<P>This ensures a seamless and secure onboarding flow.</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; Search & Sort
								</H4>
								<P>To help manage large teams, the page includes:</P>
								<ol className="list-decimal px-10 space-y-4">
									<li><strong>Search bar- </strong>find users by name, username, or email</li>
									<li><strong>Clear filters- </strong>reset sorting and results instantly</li>
								</ol>
								<P>This is designed for fast navigation and administration efficiency.</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />

							</div>
							<div>
								<H4>
									&rarr; Role Management
								</H4>
								<P>Each user has a dedicated Role button. Clicking it allows you to change the user's role based on your access policies. Available roles may include:</P>
								<ol className="list-decimal px-10 space-y-4">
									<li><strong>Owner</strong> - Full system access including deletion rights and role management.</li>
									<li><strong>Admin</strong> - Can manage users, edit items, and access all modules.</li>
									<li><strong>Manager</strong> - Can process orders, manage products, and view stats.</li>
									<li><strong>Staff</strong> - Limited access; typically operational tasks like scanning or order creation.</li>
								</ol>

								<P>Role-based access control helps you enforce security and least-privilege principles.</P>
								<hr className="dark:border-gray-100 border-gray-700 my-5" />
							</div>
							<div>
								<H4>
									&rarr; Manage Employee Actions
								</H4>
								<P>Each user has a dedicated Role button. Clicking it allows you to change the user's role based on your access policies. Available roles may include:</P>
								<ul className="list-decimal px-10 space-y-4">
									<li><strong>Role</strong> – Change the access level of the employee.</li>
									<li><strong>Manager (or other role label)</strong> – Shows the current role assigned.</li>
									<li><strong>Delete</strong> – Removes the employee from the organization permanently.</li>
								</ul>
								<P>Role changes apply instantly, ensuring immediate security control.</P>
								<P>🛑 Note: Only users with administrative privileges can modify roles or delete employees.</P>
							</div>
						</DocSec>
					</div>
				</div>
			</main>
		</SidebarProvider>
	);
}

export default Docs;
