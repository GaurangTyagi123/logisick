// import useAuthStore from '@/stores/useAuthStore';
import UserAvatar from './avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from './ui/button';
import type React from 'react';
import { useQueryClient } from '@tanstack/react-query';
// import useAuthStore from '@/stores/useAuthStore';
import useLogout from '@/hooks/useLogout';

function UserButton() {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<Record<string, User> | undefined>([
        'user',
    ])?.user;
    // const {logout } = useAuthStore();
    const { logoutFn: logout,isPending:isLoggingOut } = useLogout();
    const navigate = useNavigate();
    const userButtonHidden = useLocation().pathname.startsWith('/profile');

    function handleLogout(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        logout();
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="">
                    <UserAvatar
                        customSeed={user?.avatar || '12345678'}
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
                <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                    Logout
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default UserButton;
