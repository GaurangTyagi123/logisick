import clsx from "clsx";
import useModeStore from "@/stores/useModeStore";
import Button from "@/components/ui/button";
import { Sun, Moon, System } from "@/assets/icons/ModeToggleIcons";

interface ThemeToggleProps {
	classname?: string;
}

/**
 * @compoenent a button to cycle through theme modes 
 * @param className string of tailwind classes added at parent 
 * @returns a button component
 */
function ThemeToggle({ classname }: ThemeToggleProps) {
	const { setMode, mode } = useModeStore();

	/**
	 * @objective function to handle change of theme on user click
	 */
	function handleThemeChange(): void {
		// e.stopPropagation();
		if (mode === "light") setMode("dark");
		else if (mode === "dark") setMode("system");
		else if (mode === "system") setMode("light");
	}
	
	return (
		<Button
			onClick={handleThemeChange}
			title="toggle colour theme"
			variant={"outline"}
			className={clsx(classname, "cursor-pointer")}
		>
			{mode === "system" && <System strokeWidth={2.5} />}
			{mode === "light" && <Sun strokeWidth={2.5} />}
			{mode === "dark" && <Moon strokeWidth={2.5} />}
		</Button>
	);
}

export default ThemeToggle;
