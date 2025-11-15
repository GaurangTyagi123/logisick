"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron = require("electron");
// context bridge of electron for ui/frontend 
electron.contextBridge.exposeInMainWorld("electron", {});
