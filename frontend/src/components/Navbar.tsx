import { Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import Button from '@/components/ui/button';
import { Large } from '@/components/ui/Typography';
import UserButton from '@/components/UserButton';
import ThemeToggle from '@/components/ThemeToggle';

interface NavbarProps {
    hide?: {
        logo?: boolean;
        options?: boolean;
        userButton?: boolean;
        loginRegisterButton?: boolean;
    };
}

/**
 * @component a component to be used as navbar across multiple pages
 * @param hide an object to specify which part of navbar sould be hidden 
 * @options-to-hide logo, User Button, Login/register Button  
 * @returns react component
 */
function Navbar({
    hide = {
        logo: false,
        userButton: false,
        loginRegisterButton: false,
    },
}: NavbarProps) {
    const queryClient = useQueryClient();
    const user = queryClient.getQueryData<Record<string, User> | undefined>([
        'user',
    ])?.user;
    hide.userButton = hide.userButton || !user;
    hide.loginRegisterButton = hide.loginRegisterButton || !!user;

    return (
        <div className="flex justify-end gap-2 w-full h-10 px-2 mt-2">
            {/* Logo */}
            {!hide.logo && (
                <Button
                    asChild
                    variant={'ghost'}
                    title="Go to homepage"
                    className="h-full p-0.5 w-36 aspect-square mr-auto flex items-center"
                >
                    <Link to={{ pathname: '/' }}>
                        <img
                            src="/assets/appicon.png"
                            alt="applogo"
                            className="h-full bg-ls-bg-900 p-0.5 rounded-md"
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
                    <Link to={{ pathname: '/authenticate' }}>
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
