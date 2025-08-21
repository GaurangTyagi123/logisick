import clsx from "clsx";
import { Moon } from "../assets/icons/moon";
import { Sun } from "../assets/icons/sun";
import { System } from "../assets/icons/system";
import useModeStore from "../stores/useModeStore";

interface ThemeToggleProps {
	classname?: string;
}

function ThemeToggle({ classname }: ThemeToggleProps) {
	const { setMode, mode } = useModeStore();

	function handleThemeChange(e: React.MouseEvent<HTMLButtonElement>): void {
		e.stopPropagation();
		if (mode === "light") setMode("dark");
		else if (mode === "dark") setMode("system");
		else if (mode === "system") setMode("light");
	}
	return (
		<button
			onClick={handleThemeChange}
			title="toggle colour theme"
			className={clsx(classname, "cursor-pointer")}
		>
			{mode === "system" && <System className="w-full h-full" />}
			{mode === "light" && <Sun className="w-full h-full" />}
			{mode === "dark" && <Moon className="w-full h-full" />}
		</button>
	);
}

export default ThemeToggle;
