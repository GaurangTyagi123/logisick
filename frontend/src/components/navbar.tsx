import { Menu } from "@/assets/icons/HamBurger";
import Button from "./ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useAuthStore from "@/stores/useAuthStore";
import ThemeToggle from "./ThemeToggle";
import UserButton from "./UserButton";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "@/assets/appicon.png";
import { H3 } from "./ui/Typography";

function Navbar() {
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const dropdownHidden = useLocation().pathname === "/";

	return (
		<div className="flex justify-end gap-2 w-full h-10 px-2 mt-2">
			{/* Logo */}
			<Button
				variant={"ghost"}
				onClick={() => navigate("/")}
				title="Go to homepage"
				className="h-full p-0.5 aspect-square mr-auto flex items-center"
			>
				<img src={logo} alt="applogo" className="h-full bg-zinc-900 p-0.5 px-1 rounded-md" />
				<H3>LogiSick</H3>
			</Button>
			{/* option menu in small screens */}
			{dropdownHidden && (
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
			)}
			{/* UserButton */}
			<UserButton />
			{/* login/register button */}
			{!user && (
				<Button onClick={() => navigate("/authenticate")}>
					Login/Register
				</Button>
			)}
			{/* Theme toggle */}
			<ThemeToggle />
		</div>
	);
}

export default Navbar;
