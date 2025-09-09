import { Link } from "react-router-dom";

import notfound from "@/assets/notfound.svg";

import Navbar from "@/components/Navbar";
import Button from "@/components/ui/button";
import { H1, Large } from "@/components/ui/Typography";

function Notfound() {
	return (
		<div className="h-screen w-full flex flex-col justify-between items-center px-4 bg-zinc-300 dark:bg-zinc-900">
			<Navbar hide={{ userButton: true, loginRegisterButton: true }} />
			<div className="grid place-items-center grid-cols-1 md:grid-cols-5 container">
				<Button
					asChild
					className="my-4 md:mb-0 md:mr-auto col-span-1"
					variant={"outline"}
				>
					<Link to={"/"}>Go to Home Page</Link>
				</Button>
				<div className="col-span-1 md:col-span-3 grid place-items-center">
					<H1>Path Not Found</H1>
					<Large className="text-center">
						Page you are looking for is either don't exists or can't
						be found
					</Large>
				</div>
				<div className="col-span-1"></div>
			</div>
			<img
				src={notfound}
				alt="Path Not Found"
				className="h-9/12 max-w-screenmb-auto"
			/>
		</div>
	);
}

export default Notfound;
