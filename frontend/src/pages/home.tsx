import useModeStore from "@/stores/useModeStore";
import ThemeToggle from "../components/ThemeToggle";
import clsx from "clsx";
import Button from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Separator } from "@/components/ui/separator";

import { Menu } from "@/assets/icons/HamBurger";
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
import useAuthStore from "@/stores/useAuthStore";
import UserButton from "@/components/UserButton";

function Home() {
	const isDark = useModeStore().getTheme() === "dark";
	const navigate = useNavigate();
	const { user } = useAuthStore();
	return (
		<div
			className={clsx(
				"w-full p-4 grid gap-3 h-auto",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			{/* topbar */}
			<div className="flex justify-end gap-2">
				{/* option menu in small screens */}
				<DropdownMenu>
					<DropdownMenuTrigger className="md:hidden mr-auto ">
						<Button asChild className="w-full">
							<Menu />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuLabel>Options</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Product</DropdownMenuItem>
						<DropdownMenuItem>Community</DropdownMenuItem>
						<DropdownMenuItem>Docs</DropdownMenuItem>
						<DropdownMenuItem>Pricing</DropdownMenuItem>
						<DropdownMenuItem>Contact</DropdownMenuItem>
						<DropdownMenuItem>Link</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
				{user ? (
					<UserButton />
				) : (
					<Button onClick={() => navigate("/authenticate")}>
						Login/Register
					</Button>
				)}
				<ThemeToggle />
			</div>
			{/* tabs bar */}
			<div className="flex flex-col justify-between gap-2 mt-4 md:mt-0">
				<BigHeading />
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
					<Button className="text-xl" variant={"link"}>
						Docs
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
