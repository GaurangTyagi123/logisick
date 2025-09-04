import BigHeading from "@/components/BigHeading";
import { Login, Register } from "@/components/AuthenForms";

import { useState } from "react";
import Navbar from "@/components/Navbar";

function Authenticate() {
	const [formType, setFormType] = useState<"login" | "register">("login");
	return (
		<div className="w-full px-4 flex flex-col h-auto min-h-screen dark:bg-zinc-900">
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
