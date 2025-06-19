const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// Paths
const fabricDir = path.resolve(__dirname, "../node_modules/@erase2d/fabric");
const inputFile = path.join(fabricDir, "dist/fabric/index.js");
const outputFile = path.join(fabricDir, "dist/fabric/index.cjs.js");
const pkgPath = path.join(fabricDir, "package.json");

// Step 1: Compile index.js to CommonJS using Rollup
try {
	console.log("🛠️  Building CommonJS version with Rollup...");
	execSync(`npx rollup ${inputFile} --file ${outputFile} --format cjs`, { stdio: "inherit" });
	console.log("✅ Rollup build completed.");
} catch (err) {
	console.error("❌ Rollup build failed:", err);
	process.exit(1);
}

// Step 2: Patch package.json to add require field
try {
	const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));

	if (!pkg.exports || !pkg.exports["."]) {
		console.error("❌ Invalid exports format in @erase2d/fabric package.json");
		process.exit(1);
	}

	pkg.exports["."].require = "./dist/fabric/index.cjs.js";

	fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), "utf8");
	console.log("✅ Patched exports.require in @erase2d/fabric package.json");
} catch (err) {
	console.error("❌ Failed to patch package.json:", err);
}
