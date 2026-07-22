/* eslint-disable no-console */
/**
 * Generates src/components/fields/location-field/singapore-boundary.data.ts from SLA's
 * National Map Polygon dataset (https://data.gov.sg, dataset "National Map Polygon").
 *
 * Usage: node scripts/generate-singapore-boundary.js <path-to-NationalMapPolygon.geojson>
 *
 * The script:
 * 1. keeps only the "Layers/Coastal_Outlines" features (landmass outlines);
 * 2. splits them into Singapore outlines and non-Singapore (JOHOR) context outlines by NAME;
 * 3. drops holes and altitude values, simplifies each ring (Douglas-Peucker) and rounds
 *    coordinates, so the data is small enough to embed in the library bundle.
 */
const fs = require("fs");
const path = require("path");

const SIMPLIFY_TOLERANCE_DEG = 0.0005; // ~55m, small vs the waters tolerance used at runtime
const COORD_DECIMALS = 5; // ~1.1m
const LNG_SCALE = Math.cos((1.35 * Math.PI) / 180); // longitude degree shrink at Singapore's latitude

const inputPath = process.argv[2];
if (!inputPath) {
	console.error("Usage: node scripts/generate-singapore-boundary.js <path-to-NationalMapPolygon.geojson>");
	process.exit(1);
}

const geojson = JSON.parse(fs.readFileSync(inputPath, "utf8"));

const perpendicularDistance = (pt, lineStart, lineEnd) => {
	const x = pt[0] * LNG_SCALE;
	const y = pt[1];
	const x1 = lineStart[0] * LNG_SCALE;
	const y1 = lineStart[1];
	const x2 = lineEnd[0] * LNG_SCALE;
	const y2 = lineEnd[1];
	const dx = x2 - x1;
	const dy = y2 - y1;
	if (dx === 0 && dy === 0) return Math.hypot(x - x1, y - y1);
	const t = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / (dx * dx + dy * dy)));
	return Math.hypot(x - (x1 + t * dx), y - (y1 + t * dy));
};

const douglasPeucker = (points, tolerance) => {
	if (points.length <= 2) return points;
	let maxDist = 0;
	let index = 0;
	for (let i = 1; i < points.length - 1; i++) {
		const dist = perpendicularDistance(points[i], points[0], points[points.length - 1]);
		if (dist > maxDist) {
			maxDist = dist;
			index = i;
		}
	}
	if (maxDist <= tolerance) return [points[0], points[points.length - 1]];
	const left = douglasPeucker(points.slice(0, index + 1), tolerance);
	const right = douglasPeucker(points.slice(index), tolerance);
	return left.slice(0, -1).concat(right);
};

const simplifyRing = (ring) => {
	// drop altitude + closing point, simplify, then round
	const open = ring.map(([lng, lat]) => [lng, lat]);
	if (open.length > 1 && open[0][0] === open[open.length - 1][0] && open[0][1] === open[open.length - 1][1]) {
		open.pop();
	}
	const simplified = douglasPeucker(open, SIMPLIFY_TOLERANCE_DEG);
	if (simplified.length < 3) return undefined;
	// output as [lat, lng] to match the engine's ILocationCoord convention
	return simplified.map(([lng, lat]) => [Number(lat.toFixed(COORD_DECIMALS)), Number(lng.toFixed(COORD_DECIMALS))]);
};

const sgRings = [];
const nonSGRings = [];
let inputPoints = 0;

geojson.features.forEach((feature) => {
	const geometry = feature.geometry;
	const properties = feature.properties || {};
	if (!geometry || properties.FOLDERPATH !== "Layers/Coastal_Outlines") return;

	const polygons =
		geometry.type === "Polygon"
			? [geometry.coordinates]
			: geometry.type === "MultiPolygon"
			? geometry.coordinates
			: [];
	const isNonSG = (properties.NAME || "").toUpperCase().includes("JOHOR");

	polygons.forEach((rings) => {
		const outerRing = rings[0]; // holes are dropped: enclosed areas (e.g. inland water) count as part of the landmass
		if (!outerRing) return;
		inputPoints += outerRing.length;
		const simplified = simplifyRing(outerRing);
		if (!simplified) return;
		(isNonSG ? nonSGRings : sgRings).push(simplified);
	});
});

const outputPoints = [...sgRings, ...nonSGRings].reduce((sum, ring) => sum + ring.length, 0);

const format = (rings) =>
	rings.map((ring) => `\t[\n\t\t${ring.map(([lat, lng]) => `[${lat}, ${lng}]`).join(",\n\t\t")},\n\t]`).join(",\n");

// The leading banner is marked @license so bundlers (e.g. terser, which this library's rollup build uses)
// keep it in the shipped output — the Singapore Open Data Licence requires the attribution to survive minification.
const output = `/*!
 * @license
 * Simplified coastal outlines of Singapore, derived from SLA's National Map Polygon dataset
 * (data.gov.sg, dataset "National Map Polygon", "Layers/Coastal_Outlines" features).
 * Contains public sector information licensed under the Singapore Open Data Licence
 * (https://data.gov.sg/open-data-licence).
 *
 * Rings are [lat, lng] pairs, simplified to ~${Math.round(SIMPLIFY_TOLERANCE_DEG * 111320)}m tolerance.
 * NON_SG_COASTAL_OUTLINES are the neighbouring JOHOR (MALAYSIA) landmasses included in the dataset
 * for cartographic context; they are used to tell Malaysian land apart from Singapore.
 *
 * Do not edit by hand — regenerate via: node scripts/generate-singapore-boundary.js <path-to-NationalMapPolygon.geojson>
 */

/**
 * Human-readable attribution for the embedded Singapore boundary data. Exposed as a runtime value (in
 * addition to the @license banner above) so consuming apps can surface the attribution in their UI.
 */
export const SG_BOUNDARY_ATTRIBUTION =
	'Boundary data derived from SLA\\'s "National Map Polygon" dataset on data.gov.sg, ' +
	"licensed under the Singapore Open Data Licence (https://data.gov.sg/open-data-licence).";

export const SG_COASTAL_OUTLINES: [number, number][][] = [
${format(sgRings)},
];

export const NON_SG_COASTAL_OUTLINES: [number, number][][] = [
${format(nonSGRings)},
];
`;

const outPath = path.join(
	__dirname,
	"..",
	"src",
	"components",
	"fields",
	"location-field",
	"singapore-boundary.data.ts"
);
fs.writeFileSync(outPath, output);
console.log(
	`Wrote ${outPath}\n` +
		`rings: SG=${sgRings.length}, nonSG=${nonSGRings.length}; points: ${inputPoints} -> ${outputPoints}; ` +
		`file size: ${(fs.statSync(outPath).size / 1024).toFixed(1)} KB`
);
