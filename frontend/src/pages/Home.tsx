import { Link } from "react-router-dom";

import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BigHeading from "@/components/BigHeading";
import HexBox from "@/components/HexBox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "@/assets/icons/HamBurger";
import { BookOpen, Star } from "@/assets/icons/Homepage";
import illus from "@/assets/illus.svg";
import { Truck, Report } from "@/assets/icons/Homepage";

/**
 * @component a page to be used as home page of app
 * @returns page/react component
 */
function Home() {
	return (
		<div className="w-full px-4 grid gap-3 h-auto bg-zinc-200 dark:bg-zinc-900">
			{/* topbar */}
			<Navbar hide={{ logo: true }} />
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
					<Button className="text-xl" variant={"link"} asChild>
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
			<main className="md:mx-10 p-2 text-black">
				{/* hero */}
				<div
					className="w-full min-h-120 flex p-4 flex-col items-center lg:flex-row justify-center bg-white dark:bg-zinc-200"
					style={{
						boxShadow:
							"0 0 50px -12px var(--tw-shadow-color, rgb(0 0 0 / 0.25)",
					}}
				>
					<div className="flex flex-col gap-6 md:p-10 max-w-2xl">
						<h2 className="text-4xl text-center md:text-start md:text-6xl w-full text-balance jet-brains text-zinc-900">
							Streamline Your Supply Chain
						</h2>
						<p
							className="text-xl text-balance text-center lg:text-start"
							style={{ fontFamily: "TimesNewRoman" }}
						>
							Track, manage and analyze your inventory with ease.
						</p>
						<div className="flex gap-2 justify-center lg:justify-start">
							<Button className="shadow-xl bg-green-500 hover:bg-green-600  dark:bg-green-500 border-1 border-black">
								<Star />
								Get Started
							</Button>
							<Button className="shadow-xl border-1 border-black">
								<BookOpen />
								Learn More
							</Button>
						</div>
						<div className="flex gap-2 flex-wrap justify-center lg:justify-start">
							<HexBox
								heading="Inventory Tracking"
								icon={<Truck/>}
								text="Easily track stock levels across multiple locations."
							/>
							<HexBox
								heading="Report & Analytics"
								icon={<Report/>}
								text="Gain insights with customizable reports & analytics."
							/>
						</div>
					</div>
					<img
						src={illus}
						srcSet=""
						alt=""
						className="sm:w-5/12 w-full"
					/>
				</div>
			</main>
			{/* Footer */}
			<Footer />
		</div>
	);
}

export default Home;
