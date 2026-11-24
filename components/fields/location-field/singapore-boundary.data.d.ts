/*!
 * @license
 * Simplified coastal outlines of Singapore, derived from SLA's National Map Polygon dataset
 * (data.gov.sg, dataset "National Map Polygon", "Layers/Coastal_Outlines" features).
 * Contains public sector information licensed under the Singapore Open Data Licence
 * (https://data.gov.sg/open-data-licence).
 *
 * Rings are [lat, lng] pairs, simplified to ~56m tolerance.
 * NON_SG_COASTAL_OUTLINES are the neighbouring JOHOR (MALAYSIA) landmasses included in the dataset
 * for cartographic context; they are used to tell Malaysian land apart from Singapore.
 *
 * Do not edit by hand — regenerate via: node scripts/generate-singapore-boundary.js <path-to-NationalMapPolygon.geojson>
 */
/**
 * Human-readable attribution for the embedded Singapore boundary data. Exposed as a runtime value (in
 * addition to the @license banner above) so consuming apps can surface the attribution in their UI.
 */
export declare const SG_BOUNDARY_ATTRIBUTION: string;
export declare const SG_COASTAL_OUTLINES: [number, number][][];
export declare const NON_SG_COASTAL_OUTLINES: [number, number][][];
