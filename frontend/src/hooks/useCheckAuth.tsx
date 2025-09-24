import { checkAuth } from '@/services/apiAuth';
import { useQuery } from '@tanstack/react-query';

/**
 * @brief hook for user state in app and if user is authenticated
 * @returns user state of app from react-query
 */
function useCheckAuth() {
    const { data: user, isPending } = useQuery({
        queryKey: ['user'],
        queryFn: checkAuth, 
    });
    return { user, isPending };
}

export default useCheckAuth;
