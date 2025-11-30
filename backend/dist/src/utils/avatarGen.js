"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genProfileString = genProfileString;
// Generates a random seed for generating random user avatar
function genProfileString(len) {
    const all = "abcdefghijklmnopqrstuvwxyzBCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let ret = "";
    for (let i = 0; i < len; i++) {
        ret += all[Math.floor(Math.random() * 62)];
    }
    return ret;
}
