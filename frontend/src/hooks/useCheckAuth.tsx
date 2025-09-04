import { checkAuth } from '@/services/apiAuth';
import { useQuery } from '@tanstack/react-query';

function useCheckAuth() {
    const { data: user, isPending } = useQuery({
        queryKey: ['user'],
        queryFn: checkAuth,
    });
    return { user, isPending };
}

export default useCheckAuth;
