import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { getAssetPath, getPreloadPath, getUIPath } from "./pathResolver.js";
import { handleCloseEvent, isDev } from "./utils.js";
import { createTray } from "./tray.js";

app.on("ready", () => {
	// creating app window
	const main = new BrowserWindow({
		icon: path.join(getAssetPath(), "appicon.png"),
		webPreferences: {
			preload: getPreloadPath(),
			nodeIntegration: false,
			contextIsolation: true,
			partition: "persist:main",
		},
	});

	// setting view in different environment
	if (isDev()) {
		main.loadURL("http://localhost:5173");
	} else {
		Menu.setApplicationMenu(null);
		main.loadFile(getUIPath());
	}

	// adding app tray in taskbar
	createTray(main);

	// managing custom closing behaviour
	handleCloseEvent(main);
});
