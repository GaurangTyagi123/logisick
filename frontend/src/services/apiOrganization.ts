import axinstance from "@/utils/axios"
import { handleError } from "@/utils/handleError"

type getMyOrgType = ()=>Promise<Org | object | undefined>

export const getMyOrg:getMyOrgType = async () => {
    try {
        const res = await axinstance.get<{
            data: { org: Org; message?: string };
            status: string;

        }>("/v1/org/myorg");
        if (res.data && res.data.data.org) {
            return res.data.data.org;
        } 
        else {
            handleError(new Error("No organization found"),"No such organization found");
        }
    }
    catch (err) {
        // handleError(err);
        console.log(err)
    }
}