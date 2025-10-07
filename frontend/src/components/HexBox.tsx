import type { ReactNode } from "react";

interface HexBoxProps {
	icon: ReactNode;
	heading: string;
	text: string;
}

/**
 * @component a hexagonal box to use as a styled component iwht heading, icon and body
 * @param icon string icon name to specify whihc icon to choose ("truck" | "report")
 * @param heading string heading for the hexbox
 * @param text string body text of the hexbox
 * @returns a styled react component
 */
function HexBox({ icon, heading, text }: HexBoxProps) {
	return (
		<div
			className="bg-zinc-300 p-3 shadow-2xl max-w-73 h-25 "
			style={{
				clipPath:
					"polygon(1rem 0%, calc(100% - 1rem) 0%, 100% 50%, calc(100% - 1rem) 100%, 1rem 100%, 0% 50%)",
			}}
		>
			<h3 className="flex text-lg md:text-xl gap-1 items-center font-semibold justify-center king-julian">
				{icon}
				{heading}
			</h3>
			<p className="text-center" style={{ fontFamily: "TimesNewRoman" }}>
				{text}
			</p>
		</div>
	);
}

export default HexBox;
