"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_controller_1 = require("../controllers/auth.controller");
const userRouter = (0, express_1.Router)();
// End point to get all the users belonging to a particular organization
userRouter.route("/").get(auth_controller_1.protect, /*restrictTo('admin'),*/ user_controller_1.getUsers);
// End point to update user's profile data
userRouter
    .route("/updateMe")
    .post(auth_controller_1.protect, user_controller_1.updateUser)
    .delete(auth_controller_1.protect, user_controller_1.deleteUser);
userRouter.post("/updatePassword", auth_controller_1.protect, auth_controller_1.updatePassword);
userRouter.route("/:id").get(auth_controller_1.protect, /* restrictTo('admin'),*/ user_controller_1.getUser);
exports.default = userRouter;
