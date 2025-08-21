import { create } from "zustand";

type Mode = "dark" | "light" | "system";

interface ModeProps {
	mode: Mode;
	setMode: (inputMode: Mode) => void;
	getTheme: () => "dark" | "light";
}

const useModeStore = create<ModeProps>((set) => ({
	mode: (() => {
		const value = localStorage.getItem("shade-ui-mode");
		return value &&
			(value === "dark" || value === "light" || value === "system")
			? value
			: "system";
	})(),
	setMode: (inputMode: Mode) => {
		localStorage.setItem("shade-ui-mode", inputMode);
		set({ mode: inputMode });
	},
	getTheme: (): "dark" | "light" => {
		const currentMode = useModeStore.getState().mode;
		if (currentMode === "system") {
			const systemTheme = window.matchMedia("(prefers-color-scheme:dark)")
				.matches
				? "dark"
				: "light";
			return systemTheme;
		}
		return currentMode;
	},
}));

export default useModeStore;
