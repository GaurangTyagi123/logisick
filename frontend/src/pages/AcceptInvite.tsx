import BigHeading from "@/components/BigHeading";
import Button from "@/components/ui/button";
import useAcceptInvite from "@/hooks/emp/useAcceptInvite";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AcceptInvite() {
	const { token } = useParams();
	const { acceptInvitation, isPending } = useAcceptInvite();

	const handleAcceptInvite = () => {
		if (!token) toast.error("No invitation token found");
		else acceptInvitation({ token });
	};
	// TODO : if not authenticated navigate to authenticate page

	return (
		<div className="h-dvh bg-ls-bg-300 dark:bg-ls-bg-dark-800 flex flex-col justify-center items-center">
			<BigHeading center />
			<div className="max-w-lg p-2 grid">
				<Button disabled={isPending} onClick={handleAcceptInvite}>
					Accept Invitation
				</Button>
			</div>
		</div>
	);
}

export default AcceptInvite;
