"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const oauth_controller_1 = __importDefault(require("../controllers/oauth.controller"));
const oauthRouter = (0, express_1.Router)();
// End-point to google email id selection screen
oauthRouter.get('/google', passport_1.default.authenticate('google', {
    scope: ['profile', 'email'],
}));
// End-point for handling user's google email id data
oauthRouter.get('/google/redirect', passport_1.default.authenticate('google', { session: false }), oauth_controller_1.default);
exports.default = oauthRouter;
