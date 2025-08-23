import clsx from "clsx";
import useModeStore from "../stores/useModeStore";
import Button from "./ui/button";
import { Sun, Moon, MonitorSmartphone as System } from "lucide-react";

interface ThemeToggleProps {
	classname?: string;
}

function ThemeToggle({ classname }: ThemeToggleProps) {
	const { setMode, mode } = useModeStore();

	function handleThemeChange(): void {
		// e.stopPropagation();
		console.log("button clicked");
		if (mode === "light") setMode("dark");
		else if (mode === "dark") setMode("system");
		else if (mode === "system") setMode("light");
	}
	return (
		<Button
			onClick={handleThemeChange}
			title="toggle colour theme"
			className={clsx(classname, "cursor-pointer")}
		>
			{mode === "system" && <System strokeWidth={2.5} />}
			{mode === "light" && <Sun strokeWidth={2.5} />}
			{mode === "dark" && <Moon strokeWidth={2.5} />}
		</Button>
	);
}

export default ThemeToggle;
