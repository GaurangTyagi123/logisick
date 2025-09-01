import { Truck, Report } from "@/assets/icons/homepage";

interface HexBoxProps {
	icon: "truck" | "report";
	heading: string;
	text: string;
}

function HexBox({ icon, heading, text }: HexBoxProps) {
	return (
		<div
			className="bg-white p-3 shadow-xl max-w-73 h-25 "
			style={{
				clipPath:
					"polygon(1rem 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0% 50%)",
			}}
		>
			<h3 className="flex text-xl md:text-2xl gap-1 items-center font-semibold justify-center ">
				{icon == "truck" && <Truck />}
				{icon == "report" && <Report />}
				{heading}
			</h3>
			<p className="text-center">{text}</p>
		</div>
	);
}

export default HexBox;
