import axinstance from "@/utils/axios";
import { handleError } from "@/utils/handleError";

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

/**
 * @brief api request to create new organization of user as owner
 * @param {orgFormType} data organization's data
 * @author `Ravish Ranjan`
 */
export const createOrg: createOrg = async (data) => {
	try {
		const res = await axinstance.post<{
			data: { org: Org; message?: string };
			status: string;
		}>("/v1/org/create", data);
		if(res.status === 201)
			return res.data.data.org;
		else {
			throw new Error('There was an error while creating the organization')
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief api request to delete organization by owner
 * @param {string} orderId order's id
 * @author `Ravish Ranjan`
 */
export const deleteOrg: deleteOrg = async (id: string) => {
	try {
		const res = await axinstance.delete(`/v1/org/${id}`);
		if (res.status !== 204) {
			handleError("There was an error in deleting your organization");
		}
	} catch (err) {
		if (err instanceof Error) handleError(err);
	}
};

/**
 * @brief api request to update organization details
 * @param {{id:string, data:orgFormType}} form update details
 * @author `Ravish Ranjan`
 */
export const updateOrg: updateOrg = async ({ id, data }) => {
	try {
		const res = await axinstance.patch(`/v1/org/${id}`, data);
		if (res.status === 200) {
			return res.data.data.org;
		} else
			handleError(
				new Error("An error occurred while updating your organization")
			);
	} catch (err) {
		if (err instanceof Error) handleError(err);
	}
};

/**
 * @brief api request to get all organitaions in which user is a employee
 * @author `Ravish Ranjan`
 */
export const getAllOrgs = async () => {
	try {
		const res = await axinstance.get("/v1/emp/myOrgs");
		if (res.status == 200) {
			return res.data.data.orgs;
		} else {
			handleError(
				new Error("An error occurred while fetching your organizations")
			);
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief api request to get user's organizations
 * @param {string} orgSlug organization's slug
 * @author `Ravish Ranjan`
 */
export const getOrganization = async (orgSlug: string) => {
	try {
		const res = await axinstance.get(`/v1/org/${orgSlug}`);
		if (res.status === 200) {
			return res.data.data.org;
		} else {
			handleError(
				new Error(
					"There was an error fetching the organization details"
				)
			);
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief api request to get all employees of an organization
 * @param {string} orgid organization's id
 * @param {number} page page no.
 * @author `Ravish Ranjan`
 */
export const getAllEmployees = async (orgid: string, page: number) => {
	try {
		const res = await axinstance.get(`/v1/emp/${orgid}?page=${page}`);
		if (res.status === 200) {
			return res.data.data;
		} else {
			handleError(new Error("There was an error fetching the employees"));
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief api request to search employees of an orgnaization
 * @param {{orgid:string,query:string,controller:any}} form search form id
 * @author `Ravish Ranjan`
 */
export const searchEmployee = async ({
	orgid,
	query,
	controller,
}: Record<string, any>) => {
	try {
		const res = await axinstance.get(
			`/v1/emp/${orgid}/search?query=${encodeURIComponent(query)}`,
			{ signal: controller.signal }
		);
		if (res.status === 200) {
			return res.data.data;
		} else {
			handleError(
				new Error("There was an error fetching the employee data")
			);
		}
	} catch (err) {
		handleError(err);
	}
};

/**
 * @brief api request to transfer ownership of organization
 * @param {{newOwnerEmail:string}} form transfer owner ship form
 * @author `Ravish Ranjan`
 */
export const transferOwnership = async ({
	newOwnerEmail,
}: {
	newOwnerEmail: string;
}) => {
	try {
		const res = await axinstance.patch("/v1/org/transfer", {
			newOwnerEmail: newOwnerEmail,
		});
		if (res.status === 200) {
			return res.data.data.org;
		} else {
			handleError(
				new Error("There was an error while transfering try again")
			);
		}
	} catch (err) {
		handleError(err);
	}
};