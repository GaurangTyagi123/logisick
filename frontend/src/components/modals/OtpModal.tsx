import Modal from "@/components/Modal";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import Button from "@/components/ui/button";
import { Close } from "@/assets/icons/Close";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";

interface OTPProps {
	otp: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setOtp: React.Dispatch<React.SetStateAction<string>>;
}

/**
 * @component a modal for profilepage which prompts user to enter otp when user want to verify email 
 * @param open a boolean value stating is modal is open
 * @param setOpen a function to change state of open of modal
 * @param otp a string state for user input of otp
 * @param setOtp a setter function for user input of otp
 * @returns gives a components as a otp entering modal to put somewhere
 */
function OtpModal({ otp, open, setOpen, setOtp }: OTPProps) {
	const { verifyEmail, isVerifingEmail } = useAuthStore();
	const queryClient = useQueryClient();

	/**
	 * @brief async function to handle user request to verify email
	 */
	async function handleVerifyEmail() {
		if (otp.trim() !== "" && otp.length === 4) {
			const res = await verifyEmail({ otp });
			console.log(res);
			if (res == "verified") {
				queryClient.refetchQueries({
					queryKey: ["user"],
				});
				setOpen(false);
			}
		} else {
			toast.error("Invalid OTP", { className: "toast" });
		}
		setOpen(false);
	}

	return (
		<Modal openModal={open}>
			<Card className="min-w-md">
				<CardHeader className="flex justify-between items-center">
					<CardTitle>Verify Email</CardTitle>
					<Button onClick={() => setOpen(false)} variant={"secondary"}>
						<Close />
					</Button>
				</CardHeader>
				<CardContent className="grid place-items-center">
					<InputOTP
						maxLength={4}
						value={otp}
						onChange={(value) => setOtp(value)}
						pattern={REGEXP_ONLY_DIGITS}
					>
						<InputOTPGroup>
							<InputOTPSlot index={0} />
							<InputOTPSlot index={1} />
							<InputOTPSlot index={2} />
							<InputOTPSlot index={3} />
						</InputOTPGroup>
					</InputOTP>
				</CardContent>
				<CardFooter>
					<Button
						className="w-full"
						type="button"
						onClick={handleVerifyEmail}
						disabled={isVerifingEmail}
					>
						Submit
					</Button>
				</CardFooter>
			</Card>
		</Modal>
	);
}

export default OtpModal;
