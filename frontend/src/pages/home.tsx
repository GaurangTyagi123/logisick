import useModeStore from "@/stores/useModeStore";
import ThemeToggle from "../components/ThemeToggle";
import clsx from "clsx";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import { Menu } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BigHeading from "@/components/BigHeading";

function Home() {
	const isDark = useModeStore().getTheme() === "dark";
	const navigate = useNavigate();
	return (
		<div
			className={clsx(
				"w-full p-4 grid gap-3 h-auto",
				isDark ? "bg-gray-900" : ""
			)}
		>
			{/* topbar */}
			<div className="flex justify-end gap-2">
				<Button onClick={() => navigate("/authenticate")}>
					Login/Register
				</Button>
				<ThemeToggle />
			</div>
			{/* tabs bar */}
			<div className="flex flex-col gap-2">
				<BigHeading />
				{/* tab-bar in large screens */}
				<div className="hidden gap-2 justify-end mr-5 lg:flex">
					<Button className="text-xl" variant={"link"}>
						Product
					</Button>
					<Button className="text-xl" variant={"link"}>
						Community
					</Button>
					<Button className="text-xl" variant={"link"}>
						Resources
					</Button>
					<Button className="text-xl" variant={"link"}>
						Pricing
					</Button>
					<Button className="text-xl" variant={"link"}>
						Contact
					</Button>
					<Button className="text-xl" variant={"link"}>
						Link
					</Button>
				</div>
				{/* option menu in small screens */}
				<DropdownMenu>
					<DropdownMenuTrigger>
						<Button asChild className="lg:hidden ml-auto w-10">
							<Menu />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Options</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Product</DropdownMenuItem>
						<DropdownMenuItem>Community</DropdownMenuItem>
						<DropdownMenuItem>Resources</DropdownMenuItem>
						<DropdownMenuItem>Pricing</DropdownMenuItem>
						<DropdownMenuItem>Contact</DropdownMenuItem>
						<DropdownMenuItem>Link</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<Separator className="mt-6" />
			{/* hero */}
			<Hero />
			{/* Footer */}
			<Footer />
		</div>
	);
}

export default Home;
