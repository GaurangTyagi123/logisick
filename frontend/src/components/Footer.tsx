import {
	Clock,
	Truck,
	Package,
	MapPin,
	Phone,
	Mail,
} from "@/assets/icons/Homepage";
import { H3, H4, P, Small } from "@/components/ui/Typography";

// information for links to put on the page
const tabLinks: { path: string; name: string }[] = [
	{ path: "/dashboard", name: "Organizations" },
	{ path: "/documentation", name: "Documentation" },
	{ path: "/profile", name: "Profile" },
];

/**
 * @component a static footer component for the home and other pages
 * @author `Ravish Ranjan`
 */
function Footer() {
	const listContentClass =
		"dark:text-muted-foreground hover:text-foreground transition-colors";
	return (
		<footer className="border-t border-border bg-ls-bg-100 dark:bg-ls-bg-dark-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Truck className="h-8 w-8 text-primary" />
							<H3 className="text-2xl font-bold text-foreground king-julian">
								LogiSick
							</H3>
						</div>
						<P className="dark:text-muted-foreground text-sm leading-relaxed jet-brains">
							Streamlining your supply chain with intelligent
							logistics solutions. From warehouse management to
							last-mile delivery, we've got you covered.
						</P>
						<div className="flex space-x-4">
							<div className="flex items-center space-x-2 text-sm dark:text-muted-foreground">
								<Clock className="h-4 w-4" />
								<Small>24/7 Support</Small>
							</div>
						</div>
					</div>

					{/* Solutions */}
					<div className="space-y-4">
						<H4 className="text-lg font-semibold text-foreground king-julian">
							Solutions
						</H4>
						<ul className="space-y-2 text-sm jet-brains">
							<li>
								<a
									href="/dashboard"
									className={listContentClass}
								>
									Inventory Management
								</a>
							</li>
							<li>
								<a
									href="/dashboard"
									className={listContentClass}
								>
									Import/Export Management
								</a>
							</li>
							<li>
								<a
									href="/dashboard"
									className={listContentClass}
								>
									Delivery Tracking
								</a>
							</li>
							<li>
								<a
									href="/dashboard"
									className={listContentClass}
								>
									Analytics & Reports
								</a>
							</li>
						</ul>
					</div>

					{/* Company */}
					<div className="space-y-4">
						<H4 className="text-lg font-semibold text-foreground king-julian">
							Company
						</H4>
						<ul className="space-y-2 text-sm jet-brains">
							{tabLinks.map((value) => {
								return (
									<li>
										<a
											href={value.path}
											className={listContentClass}
										>
											{value.name}
										</a>
									</li>
								);
							})}
						</ul>
					</div>

					{/* Contact */}
					<div className="space-y-4">
						<H4 className="text-lg font-semibold text-foreground king-julian">
							Contact
						</H4>
						<div className="space-y-3 text-sm jet-brains">
							<div className="flex items-center space-x-2 dark:text-muted-foreground">
								<Phone className="h-4 w-4" />
								<a href="tel:9973882727">
									<Small>+91 9973882727</Small>
								</a>
							</div>
							<div className="flex items-center space-x-2 dark:text-muted-foreground">
								<Mail className="h-4 w-4" />
								<a href="mailto:gaurangt.mca25@cs.du.ac.in">
									<Small>gaurangt.mca25@cs.du.ac.in</Small>
								</a>
							</div>
							<div className="flex items-start space-x-2 dark:text-muted-foreground">
								<MapPin className="h-4 w-4 mt-0.5" />
								<Small>New Delhi, 110000</Small>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-12 pt-8 border-t border-border">
					<div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 jet-brains">
						<div className="flex items-center space-x-6 text-sm dark:text-muted-foreground">
							<Small>© 2025 logisick. All rights reserved.</Small>
							<a
								href="#"
								className="hover:text-foreground transition-colors"
							>
								Privacy Policy
							</a>
							<a
								href="#"
								className="hover:text-foreground transition-colors"
							>
								Terms of Service
							</a>
						</div>
						<div className="flex items-center space-x-4">
							<div className="flex items-center space-x-2 text-sm dark:text-muted-foreground">
								<Package className="h-4 w-4" />
								<Small>Enterprise Ready</Small>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
export default Footer;
