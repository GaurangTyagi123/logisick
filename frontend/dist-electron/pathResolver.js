import { app } from "electron";
import path from "path";
import { isDev } from "./utils.js";
/**
 * @brief function to get resolved path of ui for electrin
 * @returns resolved path
 */
export function getUIPath() {
    return path.join(app.getAppPath(), "/dist-react/index.html");
}
/**
 * @brief function to get path of assets in development or production
 * @returns resolved path
 */
export function getAssetPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "/src/assets");
}
/**
 * @brief function to get path of preload file in development or production
 * @returns resolved path
 */
export function getPreloadPath() {
    return path.join(app.getAppPath(), isDev() ? "." : "..", "dist-electron/preload.cjs");
}
