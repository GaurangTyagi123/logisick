import { Link } from "react-router-dom";

import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BigHeading from "@/components/BigHeading";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "@/assets/icons/HamBurger";

/**
 * @component a page to be used as home page of app
 * @returns page/react component
 */
function Home() {
	return (
		<div className="w-full px-4 grid gap-3 h-auto dark:bg-zinc-900">
			{/* topbar */}
			<Navbar />
			{/* tabs bar */}
			<div className="flex flex-col justify-between gap-2 mt-4 md:mt-0">
				<div className="flex flex-col justify-between">
					<BigHeading />
					{/* option menu in small screens */}
					<DropdownMenu>
						<DropdownMenuTrigger className="md:hidden ml-auto ">
							<Button asChild className="w-full">
								<Menu />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							<DropdownMenuLabel>Options</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>Product</DropdownMenuItem>
							<DropdownMenuItem>Community</DropdownMenuItem>
							<DropdownMenuItem>
								<Link to={"/docs"}></Link>
							</DropdownMenuItem>
							<DropdownMenuItem>Pricing</DropdownMenuItem>
							<DropdownMenuItem>Contact</DropdownMenuItem>
							<DropdownMenuItem>Link</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{/* tab-bar in large screens */}
				<div className="hidden gap-2 justify-end mr-5 md:flex">
					{/* features */}
					<Button className="text-xl" variant={"link"}>
						Product
					</Button>
					{/* discord link */}
					<Button className="text-xl" variant={"link"}>
						Community
					</Button>
					{/* documentations */}
					<Button className="text-xl" variant={"link"} asChild	>
						<Link to={"/docs"}>Docs</Link>
					</Button>
					{/* api/feature pricing */}
					<Button className="text-xl" variant={"link"}>
						Pricing
					</Button>
					<Button className="text-xl" variant={"link"}>
						Contact
					</Button>
					{/* social links */}
					<Button className="text-xl" variant={"link"}>
						Link
					</Button>
				</div>
			</div>
			<Separator className="mt-0 md:mt-6" />
			{/* hero */}
			<Hero />
			{/* Footer */}
			<Footer />
		</div>
	);
}

export default Home;
