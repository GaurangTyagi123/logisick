import useAuthStore from "@/stores/useAuthStore";
import UserAvatar from "./avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import Button from "./ui/button";

function UserButton() {
	const { user } = useAuthStore();
	const navigate = useNavigate();

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
				<DropdownMenuItem
					onClick={() => navigate(`/profile/${user?._id}`)}
				>
					Profile
				</DropdownMenuItem>
				<DropdownMenuItem>Logout</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export default UserButton;
