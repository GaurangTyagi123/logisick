import { checkAuth } from '@/services/apiAuth';
import { useQuery } from '@tanstack/react-query';

/**
 * @brief hook to check auth state of user
 * @returns {user} `user` - function to check auth state of user request
 * @returns {boolean} `isCheckingAuth` - pending state of request
 * @author `Ravish Ranjan | Gaurang Tyagi`
 */
function useCheckAuth() {
    const { data: user, isPending:isCheckingAuth } = useQuery({
        queryKey: ['user'],
        queryFn: checkAuth, 
    });
    return { user, isCheckingAuth };
}

export default useCheckAuth;
