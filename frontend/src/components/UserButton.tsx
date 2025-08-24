import useAuthStore from "@/stores/useAuthStore";
import UserAvatar from "./avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";

function UserButton() {
	const { user } = useAuthStore();
	const navigate = useNavigate();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger>
				<div className="flex gap-2 p-1 rounded">
					<UserAvatar
						customSeed={user?.avatar || "12345678"}
						className="w-10 h-10"
					/>
					<span className="text-lg">{user?.name}</span>
				</div>
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
