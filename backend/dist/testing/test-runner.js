"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const assertion_analyser_1 = require("./assertion-analyser");
const events_1 = require("events");
const mocha_1 = __importDefault(require("mocha"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const mocha = new mocha_1.default();
const testDir = "./testing/tests";
// Add each .ts file to the Mocha instance
fs_1.default.readdirSync(testDir)
    .filter((file) => file.endsWith(".ts"))
    .forEach((file) => {
    mocha.addFile(path_1.default.join(testDir, file));
});
// Define custom emitter with extended properties
class TestEmitter extends events_1.EventEmitter {
    report;
    run;
}
const emitter = new TestEmitter();
emitter.run = function () {
    const tests = [];
    let context = "";
    const separator = " -> ";
    mocha
        .ui("tdd")
        .run()
        .on("test end", function (test) {
        let body = test.body.replace(/\/\/.*\n|\/\*.*?\*\//g, "");
        body = body.replace(/\s+/g, " ");
        const obj = {
            title: test.title,
            context: context.slice(0, -separator.length),
            state: test.state,
            assertions: (0, assertion_analyser_1.assertionAnalyser)(body),
        };
        tests.push(obj);
    })
        .on("end", function () {
        emitter.report = tests;
        emitter.emit("done", tests);
    })
        .on("suite", function (s) {
        context += s.title + separator;
    })
        .on("suite end", function (s) {
        context = context.slice(0, -(s.title.length + separator.length));
    });
};
exports.default = emitter;
