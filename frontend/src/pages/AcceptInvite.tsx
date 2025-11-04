import BigHeading from "@/components/BigHeading";
import { lazy, useEffect } from "react";
const Loading = lazy(() => import("@/components/Loading"));
import Button from "@/components/ui/button";
import { H3 } from "@/components/ui/Typography";
import useAcceptInvite from "@/hooks/emp/useAcceptInvite";
import useCheckAuth from "@/hooks/useCheckAuth";
import { useParams } from "react-router-dom";
import { toast, type Id } from "react-toastify";

function AcceptInvite() {
	const { token } = useParams();
	const { acceptInvitation, isPending } = useAcceptInvite();
	const { user, isPending: isCheckingAuth } = useCheckAuth();

	const handleAcceptInvite = () => {
		if (!token)
			toast.error("No invitation token found", { className: "toast" });
		else acceptInvitation({ token });
	};

	useEffect(() => {
		let ts: Id;
		if (!user)
			ts = toast.error("Login/Register first to accept invitatation", {
				className: "toast",
			});
		return () => toast.dismiss(ts);
	}, [user]);

	if (isCheckingAuth) return <Loading fullscreen />;
	return (
		<div className="h-dvh bg-ls-bg-300 dark:bg-ls-bg-dark-800 flex flex-col justify-center items-center">
			<BigHeading center />
			<div className="max-w-lg p-2 grid">
				{user ? (
					<Button
						disabled={isPending || !user}
						onClick={handleAcceptInvite}
					>
						Accept Invitation
					</Button>
				) : (
					<H3>Login/Register first to accept invitatation</H3>
				)}
			</div>
		</div>
	);
}

export default AcceptInvite;
