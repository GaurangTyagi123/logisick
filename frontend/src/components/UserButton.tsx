import useAuthStore from "@/stores/useAuthStore";
import UserAvatar from "./avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "./ui/button";
import type React from "react";

function UserButton() {
	const { user, logout, } = useAuthStore();
	const navigate = useNavigate();
	const userButtonHidden = useLocation().pathname.startsWith("/profile");

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
					<span>{user?.name}</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent>
				{!userButtonHidden && (
					<DropdownMenuItem onClick={() => navigate(`/profile`)}>
						Profile
					</DropdownMenuItem>
				)}
				<DropdownMenuItem onClick={handleLogout}>
					Logout
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserButton;
