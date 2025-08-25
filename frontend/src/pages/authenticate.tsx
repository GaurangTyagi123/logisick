import BigHeading from "@/components/BigHeading";
import ThemeToggle from "@/components/ThemeToggle";
import Button from "@/components/ui/button";
import useModeStore from "@/stores/useModeStore";
import { Login, Register } from "@/components/AuthenForms";

import clsx from "clsx";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Authenticate() {
	const isDark = useModeStore().getTheme() === "dark";
	const navigate = useNavigate();
	const [formType, setFormType] = useState<"login" | "register">("login");
	return (
		<div
			className={clsx(
				"w-full p-4 flex flex-col h-auto min-h-screen",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			<div className="flex justify-end gap-2">
				<Button onClick={() => navigate("/authenticate")}>
					Login/Register
				</Button>
				<ThemeToggle />
			</div>
			<BigHeading />
			<div className="grid p-4 place-items-center">
				{formType === "login" ? (
					<Login setFormType={setFormType} />
				) : (
					<Register setFormType={setFormType} />
				)}
			</div>
		</div>
	);
}

export default Authenticate;
