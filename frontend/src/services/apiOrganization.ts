import axinstance from '@/utils/axios';
import { handleError } from '@/utils/handleError';

type orgFormType = {
    name: string;
    description?: string;
    type?: string;
};
type createOrg = (data: orgFormType) => Promise<Org | object | undefined>;

export const createOrg: createOrg = async (data) => {
    try {
        const res = await axinstance.post<{
            data: { org: Org; message?: string };
            status: string;
        }>('/v1/org/create',data);
        return res.data.data.org;
    } catch (err) {
        handleError(err);
    }
};
