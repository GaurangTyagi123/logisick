import Button from "./ui/button";
import useAuthStore from "@/stores/useAuthStore";
import ThemeToggle from "./ThemeToggle";
import UserButton from "./UserButton";
import { Link } from "react-router-dom";
import logo from "@/assets/appicon.png";
import { Large } from "./ui/Typography";

interface NavbarProps {
	hide?: {
		logo?: boolean;
		options?: boolean;
		userButton?: boolean;
		loginRegisterButton?: boolean;
	};
}

function Navbar({
	hide = {
		logo: false,
		userButton: false,
		loginRegisterButton: false,
	},
}: NavbarProps) {
	const { user } = useAuthStore();
	hide.userButton = hide.userButton || !user;
	hide.loginRegisterButton = hide.loginRegisterButton || !!user;

	return (
		<div className="flex justify-end gap-2 w-full h-10 px-2 mt-2">
			{/* Logo */}
			{!hide.logo && (
				<Button
					asChild
					variant={"ghost"}
					title="Go to homepage"
					className="h-full p-0.5 aspect-square mr-auto flex items-center"
				>
					<Link to={{ pathname: "/" }}>
						<img
							src={logo}
							alt="applogo"
							className="h-full bg-zinc-900 p-0.5 px-1 rounded-md"
						/>
						<Large>LogiSick</Large>
					</Link>
				</Button>
			)}
			{/* UserButton */}
			{!hide.userButton && <UserButton />}
			{/* login/register button */}
			{!hide.loginRegisterButton && (
				<Button asChild>
					<Link to={{ pathname: "/authenticate" }}>
						Login/Regsiter
					</Link>
				</Button>
			)}
			{/* Theme toggle */}
			<ThemeToggle />
		</div>
	);
}

export default Navbar;
