import { logout } from '@/services/apiAuth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function useLogout(message: string = 'Logged-Out Successfully') {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const { mutate: logoutFn, isPending } = useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success(message, {
                className: 'toast',
            });
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            navigate('/');
        },
    });
    return { logoutFn, isPending };
}

export default useLogout;
