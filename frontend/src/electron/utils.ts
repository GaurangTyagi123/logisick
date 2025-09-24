import { app, BrowserWindow } from "electron";

/**
 * @brief function to check if app is in development or not
 * @returns boolean value
 */
export function isDev() {
	return process.env.NODE_ENV === "development";
}

/**
 * @brief function to handle state bases closing of electron app
 * @param main browser window of electron app
 */
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
