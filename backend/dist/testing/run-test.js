"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const test_runner_1 = __importDefault(require("./test-runner"));
test_runner_1.default.run();
test_runner_1.default.on("done", () => {
    console.log("Tests finished!");
    process.exit(0); // Exit with a success code
});
