import emitter from "./test-runner";

emitter.run();

emitter.on("done", (results) => {
	console.log("Tests finished!");
	process.exit(0); // Exit with a success code
});
