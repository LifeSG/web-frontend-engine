// mostly copied from mol-lib-api-contract
import isEmpty from "lodash/isEmpty";
import { YupHelper } from "../helper";

enum EUinfinType {
	LOCAL_S_PREFIX = "S",
	LOCAL_T_PREFIX = "T",
	FOREIGN_F_PREFIX = "F",
	FOREIGN_G_PREFIX = "G",
	FOREIGN_M_PREFIX = "M",
}

const DIGIT_WEIGHTS = [2, 7, 6, 5, 4, 3, 2];
const LOCAL_SUFFIX_CHAR_MAP = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
const FOREIGN_SUFFIX_CHAR_MAP = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];
const FOREIGN_M_SUFFIX_CHAR_MAP = ["X", "W", "U", "T", "R", "Q", "P", "N", "J", "L", "K"];

function validateUinfin(uinfin: string): boolean {
	const isString = typeof uinfin === "string";

	if (isString) {
		const isValidUinfinPattern = checkUinfinPattern(uinfin);
		const isValidCheckSum = uinfin.charAt(8) === getUinfinChecksum(uinfin);

		return isValidUinfinPattern && isValidCheckSum;
	}
	return false;
}

function checkUinfinPattern(uinfin: string): boolean {
	const pattern = /^[STFGM]\d{7}[A-Z]$/;

	return pattern.test(uinfin);
}

function getUinfinChecksum(uinfin: string): string {
	let totalWeights = 0;
	for (let i = 0; i < 7; ++i) {
		totalWeights += Number(uinfin.charAt(i + 1)) * DIGIT_WEIGHTS[i];
	}

	const type = uinfin.charAt(0);
	if (type === EUinfinType.LOCAL_T_PREFIX || type === EUinfinType.FOREIGN_G_PREFIX) {
		totalWeights += 4;
	}

	if (type === EUinfinType.FOREIGN_M_PREFIX) {
		totalWeights += 3;
	}

	let checkSum: string;
	if (type === EUinfinType.LOCAL_S_PREFIX || type === EUinfinType.LOCAL_T_PREFIX)
		checkSum = LOCAL_SUFFIX_CHAR_MAP[totalWeights % 11];
	else if (type === EUinfinType.FOREIGN_M_PREFIX) checkSum = FOREIGN_M_SUFFIX_CHAR_MAP[totalWeights % 11];
	else checkSum = FOREIGN_SUFFIX_CHAR_MAP[totalWeights % 11];

	return checkSum;
}

YupHelper.addCondition("string", "uinfin", (uinfin: string) => {
	if (isEmpty(uinfin)) return true;
	return validateUinfin(uinfin);
});
