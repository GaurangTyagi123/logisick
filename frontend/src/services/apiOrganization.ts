import axinstance from '@/utils/axios';
import { handleError } from '@/utils/handleError';

type orgFormType = {
    name: string;
    description?: string;
    type?: string;
};

type createOrg = (data: orgFormType) => Promise<Org | object | undefined>;
type deleteOrg = (id: string) => Promise<void>;
type updateOrg = ({
    id,
    data,
}: {
    id: string;
    data: orgFormType;
}) => Promise<void>;

export const createOrg: createOrg = async (data) => {
    try {
        const res = await axinstance.post<{
            data: { org: Org; message?: string };
            status: string;
        }>('/v1/org/create', data);
        return res.data.data.org;
    } catch (err) {
        handleError(err);
    }
};

export const deleteOrg: deleteOrg = async (id: string) => {
    try {
        const res = await axinstance.delete(`/v1/org/${id}`);
        if (res.status !== 204) {
            handleError('There was an error in deleting your organization');
        }
    } catch (err) {
        if (err instanceof Error) handleError(err);
    }
};
export const updateOrg: updateOrg = async ({ id, data }) => {
    try {
        const res = await axinstance.patch(`/v1/org/${id}`, data);
        if (res.status === 200) {
            return res.data.data.org;
        } else
            console.log(res.data)
            handleError(
                null,
                'An error occurred while updating your organization'
            );
    } catch (err) {
        if (err instanceof Error) handleError(err);
    }
};
