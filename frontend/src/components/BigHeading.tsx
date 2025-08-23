import useModeStore from "@/stores/useModeStore";
import clsx from "clsx";

function BigHeading() {
	const isDark = useModeStore().getTheme() === "dark";
	return (
		<h1
			className={clsx(
				"text-8xl ml-15 king-julian",
				isDark ? "text-gray-300" : "text-gray-900"
			)}
		>
			LOGISICK
		</h1>
	);
}

export default BigHeading;
