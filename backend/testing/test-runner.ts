import { assertionAnalyser } from "./assertion-analyser";
import { EventEmitter } from "events";
import Mocha from "mocha";
import fs from "fs";
import path from "path";

const mocha = new Mocha();
const testDir = "./testing/tests";

// Add each .ts file to the Mocha instance
fs.readdirSync(testDir)
	.filter((file: string) => file.endsWith(".ts"))
	.forEach((file: string) => {
		mocha.addFile(path.join(testDir, file));
	});

// Define custom emitter with extended properties
class TestEmitter extends EventEmitter {
	report?: TestResult[];
	run!: () => void;
}

const emitter = new TestEmitter();

type TestResult = {
	title: string;
	context: string;
	state: "passed" | "failed" | "pending" | undefined;
	assertions: ReturnType<typeof assertionAnalyser>;
};

emitter.run = function () {
	const tests: TestResult[] = [];
	let context = "";
	const separator = " -> ";

	try {
		const runner = mocha
			.ui("tdd")
			.run()
			.on("test end", function (test) {
				let body = test.body.replace(/\/\/.*\n|\/\*.*?\*\//g, "");
				body = body.replace(/\s+/g, " ");

				const obj: TestResult = {
					title: test.title,
					context: context.slice(0, -separator.length),
					state: test.state,
					assertions: assertionAnalyser(body),
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
				context = context.slice(
					0,
					-(s.title.length + separator.length)
				);
			});
	} catch (e) {
		throw e;
	}
};

export default emitter;
