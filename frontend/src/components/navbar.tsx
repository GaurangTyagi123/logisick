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

function Navbar() {
	const { user } = useAuthStore();
	const navigate = useNavigate();
	const dropdownHidden = useLocation().pathname === "/";

	return (
		<div className="flex justify-end gap-2 w-full">
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
			<UserButton/>
			{(!user &&
				<Button onClick={() => navigate("/authenticate")}>
					Login/Register
				</Button>
			)}
			<ThemeToggle />
		</div>
	);
}

export default Navbar;
