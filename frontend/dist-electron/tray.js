import { app, Menu, Tray } from "electron";
import path from "path";
import { getAssetPath } from "./pathResolver.js";
/**
 * @brief function which adds a custom tray for electron app
 * @param main browser window of electron app
 */
export function createTray(main) {
    const tray = new Tray(path.join(getAssetPath(), process.platform === "win32" ? "icon@4x.png" : "icon.png"));
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: "Show",
            click: () => {
                main.show();
                if (app.dock)
                    app.dock.show();
            },
        },
        {
            label: "Quit",
            click: app.quit,
        },
    ]));
}
