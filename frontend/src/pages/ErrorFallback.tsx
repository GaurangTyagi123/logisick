import { Link } from "react-router-dom";


import Navbar from "@/components/Navbar";
import Button from "@/components/ui/button";
import { H1, Large } from "@/components/ui/Typography";

/**
 * @component a page to be used as a fallback page where thier is no path defined
 * @returns page/react component
 */
function ErrorFallback() {
	return (
		<div className="h-screen w-full flex flex-col justify-between items-center px-4 bg-ls-bg-300 dark:bg-ls-bg-dark-900">
			<Navbar hide={{ userButton: true, loginRegisterButton: true }} />
			<div className="grid place-items-center grid-cols-1 md:grid-cols-5 container">
				<div className="flex gap-2 items-center">
					<Button
						asChild
						className="my-4 md:mr-auto col-span-1"
						variant={"outline"}
					>
						<Link to={"/"}>Go to Home Page</Link>
					</Button>
					<Button onClick={() => window.location.reload()}>
						Check Again
					</Button>
				</div>
				<div className="col-span-1 md:col-span-3 grid place-items-center">
					<H1>Error Occured</H1>
					<Large className="text-center">
						Some error has occured. Please try again later.
					</Large>
				</div>
				<div className="col-span-1"></div>
			</div>
			<img
				src="/assets/error.svg"
				alt="Path Not Found"
				className="h-9/12 max-w-screenmb-auto"
			/>
		</div>
	);
}

export default ErrorFallback;
