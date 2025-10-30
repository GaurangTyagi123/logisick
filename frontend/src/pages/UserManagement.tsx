import EmployeeTable from "@/components/EmployeeTable";
import Loading from "@/components/Loading";
import InviteEmpModal from "@/components/modals/InviteEmpModal";
import Button from "@/components/ui/button";
import { H3 } from "@/components/ui/Typography";
import { getOrganization } from "@/services/apiOrganization";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";

function UserManagement() {
	const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);

	const { orgSlug } = useParams();
	const { data: orgData, isPending: isGettingOrg } = useQuery({
		queryKey: [`org-${orgSlug}`],
		queryFn: () => getOrganization(orgSlug as string),
	});

	return (
		<div className="gap-2 grid">
			<div className="flex flex-col gap-2 items-baseline h-full w-auto jet-brains rounded-2xl bg-ls-bg-300 dark:bg-ls-bg-dark-800">
				<div className="bg-white dark:bg-ls-bg-dark-800 outline-1 w-full p-3 rounded-2xl flex justify-between">
					<H3>User & Role</H3>
					<div>
						<Button onClick={() => setOpenInviteModal(true)}>
							Add Employee
						</Button>
					</div>
				</div>
			</div>

			{isGettingOrg ? (
				<Loading />
			) : orgData ? (
				<EmployeeTable orgid={orgData?._id} />
			) : (
				<div className="h-full w-full grid place-items-center gap-3">
					<H3>Organization doesn't have any employee.</H3>
					<Button asChild>
						<Link to={`/dashboard/${orgSlug}/user-role`}>
							Add an Employee
						</Link>
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
