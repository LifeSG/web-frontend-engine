const fs = require("fs");
const path = require("path");

const windowPath = path.resolve(__dirname, "../node_modules/jsdom/lib/jsdom/browser/Window.js");

const original = "location: { configurable: false }";
const patched = "location: { configurable: true }";

try {
	const source = fs.readFileSync(windowPath, "utf8");

	if (source.includes(patched)) {
		console.log("jsdom window.location patch already applied.");
		process.exit(0);
	}

	if (!source.includes(original)) {
		console.error("Unable to patch jsdom window.location. Expected source was not found.");
		process.exit(1);
	}

	fs.writeFileSync(windowPath, source.replace(original, patched), "utf8");
	console.log("Patched jsdom window.location to be configurable.");
} catch (error) {
	console.error("Failed to patch jsdom window.location:", error);
	process.exit(1);
}
