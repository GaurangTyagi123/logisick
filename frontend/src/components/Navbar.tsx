import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";

import Button from "@/components/ui/button";
import { Large } from "@/components/ui/Typography";
import UserButton from "@/components/UserButton";
import ThemeToggle from "@/components/ThemeToggle";
import type { ReactNode } from "react";

interface NavbarProps {
	hide?: {
		logo?: boolean;
		options?: boolean;
		userButton?: boolean;
		loginRegisterButton?: boolean;
	};
	children?: ReactNode;
}

/**
 * @component a component to be used as navbar across multiple pages
 * @param {object} hide object to hide specify which part of navbar sould be hidden
 * ```
 * {
 * 		logo: boolean,
 * 		userButton: boolean,
 * 		loginRegisterButton: boolean,
 * }
 * ```
 * @author `Ravish Ranjan`
 */
function Navbar({
	hide = {
		logo: false,
		userButton: false,
		loginRegisterButton: false,
	},
	children,
}: NavbarProps) {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData<Record<string, User> | undefined>([
		"user",
	])?.user;
	hide.userButton = hide.userButton || !user;
	hide.loginRegisterButton = hide.loginRegisterButton || !!user;

	return (
		<div className="flex justify-between items-center gap-2 w-full h-10 px-2 mt-2">
			{/* Logo */}
			{!hide.logo && (
				<Button
					asChild
					variant={"ghost"}
					title="Go to homepage"
					className="h-full p-0.5 min-w-40 aspect-square flex items-center"
				>
					<Link to={{ pathname: "/" }}>
						<img
							src="/assets/appicon.png"
							alt="applogo"
							className="h-full bg-ls-bg-900 p-0.5 rounded-md"
						/>
						<Large>LogiSick</Large>
					</Link>
				</Button>
			)}
			{children}
			{/* UserButton */}
			<div className="flex items-center gap-2 ml-auto">
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
		</div>
	);
}

export default Navbar;
