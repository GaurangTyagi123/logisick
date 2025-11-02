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
type getAllOrgs = () => Promise<Org[]>;

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
            handleError(
                new Error('An error occurred while updating your organization')
            );
    } catch (err) {
        if (err instanceof Error) handleError(err);
    }
};

export const getAllOrgs = async () => {
    try {
        const res = await axinstance.get('/v1/emp/myOrgs');
        if (res.status == 200) {
            return res.data.data.orgs;
        } else {
            handleError(
                new Error('An error occurred while fetching your organizations')
            );
        }
    } catch (err) {
        handleError(err);
    }
};

export const getOrganization = async (orgSlug: string) => {
    try {
        const res = await axinstance.get(`/v1/org/${orgSlug}`);
        if (res.status === 200) {
            return res.data.data.org;
        } else {
            handleError(new Error('There was an error fetching the organization details'));
        }
    } catch (err) {
        handleError(err);
    }
};

export const getAllEmployees = async (orgid: string,page:number) => {
    try {
        const res = await axinstance.get(`/v1/emp/${orgid}?page=${page}`);
        if (res.status === 200) {
            return res.data.data;
        } else {
            handleError(new Error('There was an error fetching the employees'));
        }
    } catch (err) {
        handleError(err);
    }
};

export const searchEmployee = async ({ orgid, query, controller }: Record<string, any>) => {
    try {
        const res = await axinstance.get(
            `/v1/emp/${orgid}/search?query=${encodeURIComponent(query)}`,
            { signal: controller.signal }
        );
        console.log("fetched emp search data",res.data);
        if (res.status === 200) {
            return res.data.data;
        } else {
            handleError(new Error('There was an error fetching the employee data'));
        }
    } catch (err) {
        handleError(err);
    }
};

export const transferOwnership = async ({
    employee
}: {
    employee: string;
}) => {
    try {
        const res = await axinstance.patch('/v1/org/transfer', {
            newOwnerId: employee
        });
        if (res.status === 200) {
            return res.data.data.org;
        } else {
            handleError(
                new Error('There was an error while transfering try again')
            );
        }
    } catch (err) {
        handleError(err);
    }
};
