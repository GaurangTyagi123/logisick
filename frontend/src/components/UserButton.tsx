// import useAuthStore from '@/stores/useAuthStore';
import UserAvatar from "@/components/UserAvatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Link, useLocation } from "react-router-dom";
import Button from "@/components/ui/button";
import type React from "react";
import { useQueryClient } from "@tanstack/react-query";
// import useAuthStore from '@/stores/useAuthStore';
import useLogout from "@/hooks/useLogout";
import { Separator } from "@/components/ui/separator";

/**
 * @component a component to server as user image button on navbar or other place
 * @returns react dropdown component
 */
function UserButton() {
	const queryClient = useQueryClient();
	const user = queryClient.getQueryData<Record<string, User> | undefined>([
		"user",
	])?.user;
	// const {logout } = useAuthStore();
	const { logoutFn: logout, isPending: isLoggingOut } = useLogout();
	const userButtonHidden = useLocation().pathname.startsWith("/profile");

	/**
	 * @brief function to handle logout request from user
	 * @param e mouse click event
	 */
	function handleLogout(e: React.MouseEvent<HTMLDivElement>) {
		e.stopPropagation();
		logout();
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button className="">
					<UserAvatar
						customSeed={user?.avatar || "12345678"}
						className="w-8 h-8"
					/>
					<span className="hidden sm:flex">{user?.name}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				<DropdownMenuLabel className="flex sm:hidden">
					{user?.name}
				</DropdownMenuLabel>
				<Separator />
				{!userButtonHidden && (
					<DropdownMenuItem asChild>
						<Link to={"/profile"}>Profile</Link>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem asChild>
					<Link to={"/organizations"}>Your Organizations</Link>
				</DropdownMenuItem>
				<DropdownMenuItem
					onClick={handleLogout}
					disabled={isLoggingOut}
				>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserButton;
