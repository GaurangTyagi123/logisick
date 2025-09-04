import { useState } from "react";
import { Input } from "./ui/input";
import Button from "./ui/button";
// import useAuthStore from "@/stores/useAuthStore";
import { Eye, EyeClosed, Google } from "@/assets/icons/authenticatepage";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { toast } from "react-toastify";
import { H2 } from "./ui/Typography";
import useLogin from "@/hooks/useLogin";
import useResetPassword from "@/hooks/useSendForgotPassword";
import useSignup from "@/hooks/useSignup";

interface FormProps {
	setFormType: React.Dispatch<React.SetStateAction<"login" | "register">>;
}

export function Login({ setFormType }: FormProps) {
	const [form, setForm] = useState({ email: "", password: "" });
	const [valid, setValid] = useState({ email: true, password: true });
	const [visi, setVisi] = useState(false);
	const { sendForgotPassword, isPending: isSendingForgotPassword } = useResetPassword();
	const { loginFn: login, isPending: isLoggingIn } = useLogin();

	const validatePassword = (password: string) => {
		if (password.trim().length >= 8) setValid({ ...valid, password: true });
		else setValid({ ...valid, password: false });
	};

	function validateEmail(email: string) {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		setValid({ ...valid, email: emailRegex.test(email) });
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		if (form.email.trim() !== "" && form.password.length >= 8) login(form);
	};

	const sendForgotMail = (): void => {
		if (form.email.trim().length == 0 && valid.email) {
			toast.error("Email is required to reset password", {
				className: "toast",
			});
			return;
		} else {
			sendForgotPassword({ email: form.email });
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col flex-1 max-w-2xl gap-4 p-4 border min-w-lg rounded-2xl shadow-2xl"
			style={{ maxWidth: "calc(100% - 2rem)" }}
		>
			<H2 className="mb-2 text-center">Login User</H2>

			<Label
				title="Email field is required"
				htmlFor="email"
				className="grid"
			>
				Email *
				<Input
					placeholder="Enter Your Email"
					type="email"
					value={form.email}
					name="email"
					required
					onChange={(e) => {
						setForm({ ...form, email: e.target.value.trim() });
						if (e.target.value.trim() != "") {
							validateEmail(e.target.value.trim());
						} else {
							setValid({ ...valid, email: true });
						}
					}}
				/>
				{!valid.email && (
					<span className="text-xs text-red-500">
						*Not a valid Email
					</span>
				)}
			</Label>
			<Label
				title="Password field is required"
				htmlFor="password"
				className="grid"
			>
				Password *
				<div className="flex items-center justify-between w-full gap-1">
					<Input
						placeholder="Enter Your Password"
						type={visi ? "text" : "password"}
						value={form.password}
						name="password"
						required
						onChange={(e) => {
							setForm({
								...form,
								password: e.target.value.trim(),
							});
							if (e.target.value.trim() != "") {
								validatePassword(e.target.value.trim());
							} else {
								setValid({ ...valid, password: true });
							}
						}}
					/>
					<Button
						onClick={() => setVisi(!visi)}
						type="button"
						variant="ghost"
					>
						{visi ? <Eye /> : <EyeClosed />}
					</Button>
				</div>
				{!valid.password && (
					<span className="text-xs text-red-500">
						*Password must be atleast 8 character
					</span>
				)}
			</Label>
			<Button
				variant={"link"}
				className=""
				onClick={sendForgotMail}
				type="button"
				disabled={isSendingForgotPassword}
			>
				Forgot Password?
			</Button>
			<Button className="mt-4" type="submit" disabled={isLoggingIn}>
				Login
			</Button>
			<Button
				variant="link"
				type="button"
				onClick={() => setFormType("register")}
			>
				Don't have an Account?
			</Button>

			<Button
				onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
					e.stopPropagation();
					const server = window.location.hostname;
					const protocol = window.location.protocol;
					const port = 8000;
					window.location.href = `${protocol}//${server}:${port}/auth/google`;
				}}
				type="button"
			>
				<Google />
				<span>Login with Google account</span>
			</Button>
		</form>
	);
}

export function Register({ setFormType }: FormProps) {
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [valid, setValid] = useState({
		email: true,
		password: true,
		confirmPassword: true,
	});
	const [visi, setVisi] = useState(false);
	const { signupFn: register, isPending: isRegistering } = useSignup();
	// const { isRegistering, register } = useAuthStore();

	const validatePassword = (password: string) => {
		if (password.trim().length >= 8) setValid({ ...valid, password: true });
		else setValid({ ...valid, password: false });
	};

	const validateConfirmPassword = (password: string) => {
		if (password.trim() === form.password.trim())
			setValid({ ...valid, confirmPassword: true });
		else setValid({ ...valid, confirmPassword: false });
	};

	function validateEmail(email: string) {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		setValid({ ...valid, email: emailRegex.test(email) });
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();
		if (
			form.name != "" &&
			form.email.trim() !== "" &&
			form.password.length >= 8 &&
			form.confirmPassword === form.password
		) {
			register(form);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			className="flex flex-col flex-1 max-w-3xl gap-4 p-4 py-4 border min-w-lg rounded-2xl shadow-2xl"
			style={{ maxWidth: "calc(100% - 2rem)" }}
		>
			<h2 className="mb-2 text-3xl text-center">Register New User</h2>
			<Label
				title="Full Name field is required"
				htmlFor="name"
				className="grid"
			>
				Full Name *
				<Input
					placeholder="Enter Your Full Name"
					type="text"
					id="name"
					value={form.name}
					name="name"
					required
					onChange={(e) => {
						setForm({
							...form,
							name: e.target.value,
						});
					}}
				/>
			</Label>
			<Label
				title="Email field is required"
				htmlFor="email"
				className="grid"
			>
				Email *
				<Input
					placeholder="Enter Your Email"
					type="email"
					value={form.email}
					name="email"
					id="email"
					required
					onChange={(e) => {
						setForm({ ...form, email: e.target.value.trim() });
						if (e.target.value.trim() != "") {
							validateEmail(e.target.value.trim());
						} else {
							setValid({ ...valid, email: true });
						}
					}}
				/>
				{!valid.email && (
					<span className="text-xs text-red-500">
						*Not a valid Email
					</span>
				)}
			</Label>
			<Label
				title="Password field is required"
				htmlFor="password"
				className="grid"
			>
				Password *
				<div className="flex items-center justify-between w-full gap-1">
					<Input
						placeholder="Enter Your Password"
						type={visi ? "text" : "password"}
						value={form.password}
						name="password"
						id="password"
						required
						onChange={(e) => {
							setForm({
								...form,
								password: e.target.value.trim(),
							});
							if (e.target.value.trim() != "") {
								validatePassword(e.target.value.trim());
							} else {
								setValid({ ...valid, password: true });
							}
						}}
					/>
					<Button
						onClick={() => setVisi(!visi)}
						type="button"
						variant="ghost"
					>
						{visi ? <Eye /> : <EyeClosed />}
					</Button>
				</div>
				{!valid.password && (
					<span className="text-xs text-red-500">
						*Password must be atleast 8 character
					</span>
				)}
			</Label>
			<Label
				title="Confirm Password field is required"
				htmlFor="confirmPassword"
				className="grid"
			>
				Confirm Password *
				<div className="flex items-center justify-between w-full gap-1">
					<Input
						placeholder="Re-enter Your Password"
						type={visi ? "text" : "password"}
						value={form.confirmPassword}
						name="confirmPassword"
						id="confirmPassword"
						required
						onChange={(e) => {
							setForm({
								...form,
								confirmPassword: e.target.value.trim(),
							});
							if (e.target.value.trim() != "") {
								validateConfirmPassword(e.target.value.trim());
							} else {
								setValid({ ...valid, confirmPassword: true });
							}
						}}
					/>
					<Button
						onClick={() => setVisi(!visi)}
						type="button"
						variant="ghost"
					>
						{visi ? <Eye /> : <EyeClosed />}
					</Button>
				</div>
				{!valid.confirmPassword && (
					<span className="text-xs text-red-500">
						*Password must same as above
					</span>
				)}
			</Label>

			<Button className="mt-4" disabled={isRegistering} type="submit">
				Register
			</Button>
			<Button
				variant="link"
				type="button"
				onClick={() => setFormType("login")}
			>
				Already have an Account?
			</Button>
			<Separator />
			<Button
				onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
					e.stopPropagation();
					const server = window.location.hostname;
					const protocol = window.location.protocol;
					const port = 8000;
					window.location.href = `${protocol}//${server}:${port}/auth/google`;
				}}
				type="button"
			>
				<Google />
				<span>Register with Google account</span>
			</Button>
		</form>
	);
}
