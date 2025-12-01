"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const authRouter = (0, express_1.Router)();
// End-point to check whether the user is logged or not
authRouter.get('/isLoggedIn', auth_controller_1.isLoggedIn);
authRouter.get('/isEmployee/:orgSlug', auth_controller_1.isEmployee);
// End-point to sign up a new user
authRouter.post('/signup', auth_middleware_1.csrfProtection, auth_controller_1.signup);
// End-point to login
authRouter.post('/login', auth_middleware_1.csrfProtection, auth_controller_1.login);
// End-point to logout
authRouter.get('/logout', auth_middleware_1.protect, auth_controller_1.logout);
authRouter.post('/refresh', auth_controller_1.refresh);
// End-points for resetting password if the user has forgotten it
authRouter.post('/forgotPassword', auth_middleware_1.csrfProtection, auth_controller_1.forgotPassword);
authRouter.patch('/resetPassword/:resetToken', auth_middleware_1.csrfProtection, auth_controller_1.resetPassword);
// End-point to verify user email
authRouter.post('/verifyEmail', auth_middleware_1.csrfProtection, auth_middleware_1.protect, auth_controller_1.verifyEmail);
exports.default = authRouter;
