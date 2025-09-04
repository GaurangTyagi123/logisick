import {
	Clock,
	Truck,
	Package,
	MapPin,
	Phone,
	Mail,
} from "@/assets/icons/homepage";

function Footer() {
	return (
		<footer className="border-t border-border bg-zinc-300 dark:bg-zinc-800">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
					{/* Company Info */}
					<div className="space-y-4">
						<div className="flex items-center space-x-2">
							<Truck className="h-8 w-8 text-primary" />
							<h3 className="text-2xl font-bold text-foreground king-julian">
								LogiSick
							</h3>
						</div>
						<p
							className="text-muted-foreground text-sm leading-relaxed"
							style={{ fontFamily: "TimesNewRoman" }}
						>
							Streamlining your supply chain with intelligent
							logistics solutions. From warehouse management to
							last-mile delivery, we've got you covered.
						</p>
						<div className="flex space-x-4">
							<div
								className="flex items-center space-x-2 text-sm text-muted-foreground"
								style={{ fontFamily: "TimesNewRoman" }}
							>
								<Clock className="h-4 w-4" />
								<span>24/7 Support</span>
							</div>
						</div>
					</div>

					{/* Solutions */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-foreground king-julian">
							Solutions
						</h4>
						<ul
							className="space-y-2 text-sm"
							style={{ fontFamily: "TimesNewRoman" }}
						>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Inventory Management
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Import/Export Management
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Delivery Tracking
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Bills Management
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Analytics & Reports
								</a>
							</li>
						</ul>
					</div>

					{/* Company */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-foreground king-julian">
							Company
						</h4>
						<ul
							className="space-y-2 text-sm"
							style={{ fontFamily: "TimesNewRoman" }}
						>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									About Us
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Products
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Community
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Resources
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Pricing
								</a>
							</li>
							<li>
								<a
									href="#"
									className="text-muted-foreground hover:text-foreground transition-colors"
								>
									Link
								</a>
							</li>
						</ul>
					</div>

					{/* Contact */}
					<div className="space-y-4">
						<h4 className="text-lg font-semibold text-foreground king-julian">
							Contact
						</h4>
						<div
							className="space-y-3 text-sm"
							style={{ fontFamily: "TimesNewRoman" }}
						>
							<div className="flex items-center space-x-2 text-muted-foreground">
								<Phone className="h-4 w-4" />
								<span>+1 (555) 123-4567</span>
							</div>
							<div className="flex items-center space-x-2 text-muted-foreground">
								<Mail className="h-4 w-4" />
								<span>support@logisick.com</span>
							</div>
							<div className="flex items-start space-x-2 text-muted-foreground">
								<MapPin className="h-4 w-4 mt-0.5" />
								<span>
									123 ABC Marg
									<br />
									New Delhi, 110000
								</span>
							</div>
						</div>
					</div>
				</div>

				{/* Bottom Section */}
				<div className="mt-12 pt-8 border-t border-border">
					<div
						className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
						style={{ fontFamily: "TimesNewRoman" }}
					>
						<div className="flex items-center space-x-6 text-sm text-muted-foreground">
							<span>© 2025 logisick. All rights reserved.</span>
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
							<div className="flex items-center space-x-2 text-sm text-muted-foreground">
								<Package className="h-4 w-4" />
								<span>Enterprise Ready</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</footer>
	);
}
export default Footer;
