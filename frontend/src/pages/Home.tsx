import { Link } from "react-router-dom";

import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import BigHeading from "@/components/BigHeading";
import { Truck, Report } from "@/assets/icons/Homepage";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu } from "@/assets/icons/HamBurger";
import { BookOpen, Star } from "@/assets/icons/Homepage";

const tabLinks: { path: string; name: string }[] = [
	{ path: "#", name: "Products" },
	{ path: "#", name: "Community" },
	{ path: "/documentation", name: "Documentation" },
	{ path: "#", name: "Pricing" },
	{ path: "#", name: "Contacts" },
	{ path: "#", name: "Links" },
];

/**
 * @component a page to be used as home page of app
 * @returns page/react component
 */
function Home() {
	return (
		<div className="w-full px-4 grid gap-3 h-auto bg-ls-bg-200 dark:bg-ls-bg-dark-900">
			{/* topbar */}
			<Navbar hide={{ logo: true }} />
			{/* tabs bar */}
			<div className="flex flex-col justify-between gap-2 mt-4 md:mt-0">
				<div className="flex flex-col justify-between">
					<BigHeading />
					{/* option menu in small screens */}
					<DropdownMenu>
						<DropdownMenuTrigger className="lg:hidden ml-auto ">
							<Button asChild className="w-full">
								<Menu />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent>
							{tabLinks.map((link, i) => (
								<DropdownMenuItem key={i}>
									<Link to={link.path} >{link.name}</Link>
								</DropdownMenuItem>
							))}
						</DropdownMenuContent>
					</DropdownMenu>
				</div>
				{/* tab-bar in large screens */}
				<div className="hidden gap-2 justify-end mr-5 lg:flex">
					{tabLinks.map((link, i) => (
						<Link to={link.path} key={i}>
							<Button
								className="text-xl text-ls-bg-dark-600 dark:text-white hover:dark:text-ls-sec-200"
								variant={"link"}
							>
								{link.name}
							</Button>
						</Link>
					))}
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
							className="text-xl text-balance text-center lg:text-start jet-brains"
							style={{ fontFamily: "TimesNewRoman" }}
						>
							Track, manage and analyze your inventory with ease.
						</p>
						<div className="flex flex-wrap gap-2 justify-center lg:justify-start">
							<Link to={"/dashboard"}>
								<Button className="shadow-xl text-black bg-ls-sec-500 hover:bg-ls-sec-600  dark:bg-ls-sec-500">
									<Star />
									Join Organizations
								</Button>
							</Link>
							<Link to={"/documentation"}>
								<Button className="shadow-xl">
									<BookOpen />
									More About Website
								</Button>
							</Link>
						</div>
						<div className="flex gap-2 flex-wrap justify-center lg:justify-start">
							<div
								className="bg-zinc-300 p-3 shadow-2xl max-w-73 h-25 "
								style={{
									clipPath:
										"polygon(1rem 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0% 50%)",
								}}
							>
								<h3 className="flex text-lg md:text-xl gap-1 items-center font-semibold justify-center king-julian">
									<Truck />
									Inventory Tracking
								</h3>
								<p
									className="text-center"
									style={{ fontFamily: "TimesNewRoman" }}
								>
									Easily track stock levels across multiple
									locations.
								</p>
							</div>
							<div
								className="bg-zinc-300 p-3 shadow-2xl max-w-73 h-25 "
								style={{
									clipPath:
										"polygon(1rem 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0% 50%)",
								}}
							>
								<h3 className="flex text-lg md:text-xl gap-1 items-center font-semibold justify-center king-julian">
									<Report />
									Report & Analytics
								</h3>
								<p
									className="text-center"
									style={{ fontFamily: "TimesNewRoman" }}
								>
									Gain insights with customizable reports &
									analytics..
								</p>
							</div>
						</div>
					</div>
					<img
						src="/assets/hero.gif"
						alt="hero illustration"
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
