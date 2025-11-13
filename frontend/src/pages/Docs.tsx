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
 * @component a page to be used as documentation page of app
 * @returns page/react component
 */
function Docs() {
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
					<div className="grid gap-3">
						<H2>User Guide</H2>
						<DocSec id="ug-getting-started" title="Getting Started">
							<div id="ug-getting-started-authenticate">
								<Large>
									1. Creating Your Account and Finding Your
									Profile
								</Large>
								<article className="docs-content">
									<H4>
										Creating Your Account and Finding Your
										Profile
									</H4>

									<P>
										Welcome! This guide will walk you
										step-by-step through creating your first
										account, logging in, and locating your
										user profile. By the end, you'll be
										fully set up and ready to go.
									</P>

									<P>Let's get started.</P>

									<H4>
										Part 1: Creating Your Account
										(Registration)
									</H4>

									<P>
										First, we need to create your account.
									</P>

									<ol className="list-decimal px-10">
										<li>
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
									<ol className="list-decimal px-10">
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
									<ol className="list-decimal px-10">
										<li>
											Look for the button that says{" "}
											<strong>
												"Sign up with Google"
											</strong>
											.
										</li>
										<li>
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

									<H4>
										Part 2: Logging In (After You're
										Registered)
									</H4>
									<P>
										Once your account is created, here is
										how you log in for future visits:
									</P>
									<ol className="list-decimal px-10">
										<li>
											Navigate to the{" "}
											<strong>"Login"</strong> or{" "}
											<strong>"Sign In"</strong> page.
										</li>
										<li>
											<strong>
												If you registered with email:
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
											Find the{" "}
											<strong>User Button</strong>. This
											might show your name, your initials,
											or a profile icon.
										</li>
										<li>
											Click on this button. A dropdown
											menu will appear.
										</li>
										<li>
											From the menu, click on the{" "}
											<strong>"Profile"</strong> option.
										</li>
									</ol>
									<blockquote>
										<P>
											<strong>Tip:</strong> We recommend
											adding a screenshot here to show
											your users exactly what to look for!
										</P>
									</blockquote>

									<h4>Method 2: Using the Direct URL</h4>
									<P>
										You can also go directly to the profile
										page at any time.
									</P>
									<ol>
										<li>
											Click on your browser's address bar.
										</li>
										<li>
											Type <code>/profile</code> after the
											website's main address.
											<blockquote>
												<P>
													(e.g.,{" "}
													<code>
														https://www.yourwebsite.com/profile
													</code>
													)
												</P>
											</blockquote>
										</li>
										<li>
											Press <strong>Enter</strong>.
										</li>
									</ol>

									<H4>Congratulations!</H4>

									<P>
										You've successfully created an account,
										learned how to log in, and found your
										profile page. You're all set!
									</P>
								</article>
							</div>
						</DocSec>
						<DocSec id="ug-dashboard" title="Dashboard">
							<H3>Dashboard</H3>
						</DocSec>
						<DocSec id="ug-reports" title="Reports">
							<H3>Reports</H3>
						</DocSec>
					</div>
					<div>
						<H2>FAQ</H2>
						<DocSec id="faq-general" title="General">
							<H3>General</H3>
						</DocSec>
						<DocSec id="faq-most-asked" title="Most">
							<H3>Most Asked</H3>
						</DocSec>
					</div>
					<div>
						<H2>Feature</H2>
						<DocSec id="feat-f1" title="Feature">
							<H3>Feature-1</H3>
						</DocSec>
						<DocSec id="feat-f2" title="Feature">
							<H3>Feature-2</H3>
						</DocSec>
						<DocSec id="feat-f3" title="Feature">
							<H3>Feature-3</H3>
						</DocSec>
						<DocSec id="feat-f4" title="Feature">
							<H3>Feature-4</H3>
						</DocSec>
						<DocSec id="feat-f5" title="Feature">
							<H3>Feature-5</H3>
						</DocSec>
					</div>
				</div>
			</main>
		</SidebarProvider>
	);
}

export default Docs;
