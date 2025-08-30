import BigHeading from "@/components/BigHeading";
import useModeStore from "@/stores/useModeStore";
import { Login, Register } from "@/components/AuthenForms";

import clsx from "clsx";
import { useState } from "react";
import Navbar from "@/components/Navbar";

function Authenticate() {
	const isDark = useModeStore().getTheme() === "dark";
	const [formType, setFormType] = useState<"login" | "register">("login");
	return (
		<div
			className={clsx(
				"w-full px-4 flex flex-col h-auto min-h-screen",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			<Navbar
				hide={{
					logo: true,
					loginRegisterButton: true,
				}}
			/>
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
