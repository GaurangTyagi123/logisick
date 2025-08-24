import { Star } from "@/assets/icons/Star";
import { BookOpen } from "@/assets/icons/BookOpen";
import Button from "./ui/button";
import illus from "@/assets/illus.svg";
import HexBox from "./HexBox";
// import HexBox from "./HexBox";

function Hero() {
	return (
		<main className="mx-10 p-2 text-black">
			{/* hero */}
			<div
				className="w-full min-h-120 flex p-4 flex-wrap justify-center "
				style={{
					backgroundColor: "hsl(var(--hue-gray-val))",
					boxShadow:
						"0 0 50px -12px var(--tw-shadow-color, rgb(0 0 0 / 0.25)",
				}}
			>
				<div className="flex flex-col gap-6 p-10 max-w-2xl highlight">
					<h2 className="text-6xl w-full text-balance jet-brains text-gray-900">
						Streamline Your Supply Chain
					</h2>
					<p
						className="text-xl text-balance text-center lg:text-start"
						style={{ fontFamily: "TimesNewRoman" }}
					>
						Track, manage and analyze your inventory with ease.
					</p>
					<div className="flex gap-2 justify-center lg:justify-start">
						<Button className="shadow-xl bg-green-500">
							<Star />
							Get Started
						</Button>
						<Button className="shadow-xl border-1 border-black">
							<BookOpen />
							Learn More
						</Button>
					</div>
					<div className="flex gap-2 flex-wrap justify-center lg:justify-start">
						<HexBox
							heading="Inventory Tracking"
							icon="truck"
							text="Easily track stock levels across multiple locations."
						/>
						<HexBox
							heading="Report & Analytics"
							icon="truck"
							text="Gain insights with customizable reports & analytics."
						/>
					</div>
				</div>
				<img src={illus} srcSet="" alt="" className="h-112" />
			</div>
		</main>
	);
}

export default Hero;
