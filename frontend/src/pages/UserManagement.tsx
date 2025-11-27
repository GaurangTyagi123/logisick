import { useState } from "react";
import EmpManagementTable from "@/components/EmpManagementTable";
import InviteEmpModal from "@/components/modals/emp/InviteEmpModal";
import Button from "@/components/ui/button";
import { H3 } from "@/components/ui/Typography";
import { checkAuth } from "@/services/apiAuth";
import { getOrganization } from "@/services/apiOrg";
import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useParams } from "react-router-dom";
import CustomTableSkeleton from "@/components/skeletons/CustomTableSkeleton";

/**
 * @component page to server as endpoint for user management
 * @author `Ravish Ranjan`
 */
function UserManagement() {
	const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);

	const { data: userData } = useQuery({
		queryKey: ["user"],
		queryFn: () => checkAuth(),
	});

	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});

	/**
	 * @brief function to check authorization of user to make changes
	 * @returns boolean - to check if the user is authorized to make changes
	 */
	const isAuthorized = () => {
		if (!userData?.user.myOrg) return false;
		if (userData?.user) return true;
		if (userData?.user._id === userData?.user.myOrg?.admin) return true;
		return false;
	};

	return (
		<div className="gap-2 grid">
			<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-1 md:p-3 rounded-lg md:rounded-2xl grid md:flex md:justify-between items-center">
				<H3>User & Role</H3>
				<div className={clsx(isAuthorized() ? "grid" : "hidden")}>
					<Button
						onClick={() => setOpenInviteModal(true)}
						disabled={!isAuthorized()}
					>
						Invite Employee
					</Button>
				</div>
			</div>

			{isGettingOrg ? (
				<CustomTableSkeleton />
			) : orgData ? (
				<EmpManagementTable
					orgid={orgData?._id}
					isAuthorized={isAuthorized}
				/>
			) : (
				<div className="h-96 w-full flex flex-col justify-center items-center gap-3 outline-1">
					<H3>Your Organization doesn't have any employees</H3>
					<Button onClick={() => setOpenInviteModal(true)}>
						Invite Employees
					</Button>
				</div>
			)}
			<InviteEmpModal
				open={openInviteModal}
				setOpen={setOpenInviteModal}
			/>
		</div>
	);
}

export default UserManagement;
