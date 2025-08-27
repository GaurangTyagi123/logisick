import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";
import Button from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import BigHeading from "@/components/BigHeading";
import Navbar from "@/components/navbar";

function Home() {
	const isDark = useModeStore().getTheme() === "dark";
	return (
		<div
			className={clsx(
				"w-full p-4 grid gap-3 h-auto",
				isDark ? "bg-zinc-900" : ""
			)}
		>
			{/* topbar */}
			<Navbar />
			{/* tabs bar */}
			<div className="flex flex-col justify-between gap-2 mt-4 md:mt-0">
				<BigHeading />
				{/* tab-bar in large screens */}
				<div className="hidden gap-2 justify-end mr-5 md:flex">
					{/* features */}
					<Button className="text-xl" variant={"link"}>
						Product
					</Button>
					{/* discord link */}
					<Button className="text-xl" variant={"link"}>
						Community
					</Button>
					{/* documentations */}
					<Button className="text-xl" variant={"link"}>
						Docs
					</Button>
					{/* api/feature pricing */}
					<Button className="text-xl" variant={"link"}>
						Pricing
					</Button>
					<Button className="text-xl" variant={"link"}>
						Contact
					</Button>
					{/* social links */}
					<Button className="text-xl" variant={"link"}>
						Link
					</Button>
				</div>
			</div>
			<Separator className="mt-0 md:mt-6" />
			{/* hero */}
			<Hero />
			{/* Footer */}
			<Footer />
		</div>
	);
}

export default Home;
