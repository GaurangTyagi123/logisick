import { updatePassword } from '@/services/apiUser';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useLogout from './useLogout';
import { useNavigate } from 'react-router-dom';

function useUpdatePassword() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { logoutFn: logout } = useLogout('Please Login again');
    const { mutate: updatePasswordFn, isPending } = useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success('Password changes successfully', {
                className: 'toast',
            });
            queryClient.invalidateQueries({
                queryKey: ['user'],
            });
            logout();
            navigate('/authenticate');
        },
        onError: (err) => {
            toast.error(err.message);
        },
    });
    return { updatePasswordFn, isPending };
}

export default useUpdatePassword;
