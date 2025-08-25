import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";

function BigHeading() {
	const isDark = useModeStore().getTheme() === "dark";
	return (
		<h1
			className={clsx(
				"text-6xl ml-0 king-julian md:text-8xl md:ml-15",
				isDark ? "text-zinc-300" : "text-zinc-900"
			)}
		>
			LOGISICK
		</h1>
	);
}

export default BigHeading;
