import { app, BrowserWindow } from "electron";

export function isDev() {
	return process.env.NODE_ENV === "development";
}

export function handleCloseEvent(main: BrowserWindow) {
	let shouldClose = false;
	main.on("close", (e) => {
		if (shouldClose) return;
		e.preventDefault();
		main.hide();
		if (app.dock) app.dock.hide();
	});
	app.on("before-quit", () => {
		shouldClose = true;
	});
	main.on("show", () => {
		shouldClose = false;
	});
}
