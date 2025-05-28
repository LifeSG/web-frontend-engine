import isEmpty from "lodash/isEmpty";
import { YupHelper } from "../helper";

const ENTITY_TYPE_INDICATORS = [
	"LP",
	"LL",
	"FC",
	"PF",
	"RF",
	"MQ",
	"MM",
	"NB",
	"CC",
	"CS",
	"MB",
	"FM",
	"GS",
	"GA",
	"GB",
	"DP",
	"CP",
	"NR",
	"CM",
	"CD",
	"MD",
	"HS",
	"VH",
	"CH",
	"MH",
	"CL",
	"XL",
	"CX",
	"RP",
	"TU",
	"TC",
	"FB",
	"FN",
	"PA",
	"PB",
	"SS",
	"MC",
	"SM",
];
function validateUen(uen: string): boolean {
	// check if uen is 9 or 10 digits
	if (uen.length < 9 || uen.length > 10) {
		return false;
	}

	uen = uen.toUpperCase();

	// (A) Businesses registered with ACRA
	if (uen.length === 9) {
		if (uen.match(/^\d{8}[A-Z]$/)) {
			return true;
		}
	} else if (uen.length === 10) {
		// (B) Local companies registered with ACRA
		if (uen.match(/^\d{9}[A-Z]$/)) {
			return true;
		}

		// (C) All other entities which will be issued new UEN
		const pattern =
			String.raw`^((R|S|T)([\d]{2})(` + ENTITY_TYPE_INDICATORS.join("|") + String.raw`)([\d]{4})([A-Z]))$`;
		if (uen.match(pattern)) {
			return true;
		}
	}

	return false;
}

YupHelper.addCondition("string", "uen", (uen: string) => {
	if (isEmpty(uen)) return true;
	return validateUen(uen);
});
