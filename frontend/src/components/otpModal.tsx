import Modal from "./Modal";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "./ui/card";
import Button from "./ui/button";
import { Close } from "@/assets/icons/Close";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "./ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { toast } from "react-toastify";
import useAuthStore from "@/stores/useAuthStore";

interface OTPProps {
	otp: string;
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	setOtp: React.Dispatch<React.SetStateAction<string>>;
}

function OtpModal({ otp, open, setOpen, setOtp }: OTPProps) {
	const { verifyEmail, isVerifingEmail } = useAuthStore();

	async function handleVerifyEmail() {
		if (otp.trim() !== "" && otp.length === 4) {
			const res = await verifyEmail({ otp });
			if (res == "verified") {
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
					<Button onClick={() => setOpen(false)}>
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
