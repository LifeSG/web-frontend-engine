import isEmpty from "lodash/isEmpty";
import { YupHelper } from "../helper";

// Myinfo name fields allow letters, spaces, and only these special characters: , ( ) / . @ - '
const HTML_SAFE_REGEX = /^[A-Za-z\s,()/.@'-]+$/;

YupHelper.addCondition("string", "htmlSafe", (value: string, htmlSafe: boolean) => {
	if (isEmpty(value) || !htmlSafe) return true;
	return HTML_SAFE_REGEX.test(value);
});
