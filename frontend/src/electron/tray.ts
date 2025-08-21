import { app, BrowserWindow, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";

export function createTray(main: BrowserWindow) {
	const tray = new Tray(
		path.join(
			getAssetPath(),
			process.platform === "win32" ? "icon@4x.png" : "icon.png"
		)
	);
	tray.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: "Show",
				click: () => {
					main.show();
					if (app.dock) app.dock.show();
				},
			},
			{
				label: "Quit",
				click: app.quit,
			},
		])
	);
}
