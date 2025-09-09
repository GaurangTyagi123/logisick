import { create } from "zustand";

type Mode = "dark" | "light" | "system";

interface ModeProps {
	mode: Mode;
	setMode: (inputMode: Mode) => void;
	getTheme: () => "dark" | "light";
}

/**
 * @objective hook to handle changing theme mode
 */
const useModeStore = create<ModeProps>((set, get) => ({
	mode: (() => {
		const value = localStorage.getItem("shade-ui-mode");
		const val =
			value === "dark" || value === "light" || value === "system"
				? value
				: "system";

		// Apply initial theme
		applyTheme(val);

		return val;
	})(), // state to get default theme nad apply it 

	/**
	 * @objective function to set theme mode
	 * @param inputMode mode to whihc we wwant to set the theme of app (light | dark | system)
	 * @effect update mode state
	 */
	setMode: (inputMode: Mode) => {
		localStorage.setItem("shade-ui-mode", inputMode);
		set({ mode: inputMode });
		applyTheme(inputMode);
	},
	/**
	 * @objective function to get theme mode (light | dark)
	 * @return gives current theme mode by resolving system theme
	 */
	getTheme: (): "dark" | "light" => {
		const currentMode = get().mode;
		if (currentMode === "system") {
			return window.matchMedia("(prefers-color-scheme: dark)").matches
				? "dark"
				: "light";
		}
		return currentMode;
	},
}));

/**
 * @objective function to apply theme mode to app
 * @param mode theme mode to apply (light | dark | system)
 */
function applyTheme(mode: Mode) {
	document.documentElement.classList.remove("dark", "light");

	if (mode === "system") {
		const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
			.matches
			? "dark"
			: "light";
		document.documentElement.classList.add(systemTheme);
	} else {
		document.documentElement.classList.add(mode);
	}
}

export default useModeStore;
