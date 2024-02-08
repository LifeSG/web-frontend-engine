import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";
import { Sanitize } from "../../shared";
import { IFilterItemLabel } from "./types";

export namespace FilterHelper {
	export const constructFormattedLabel = (
		label: string | IFilterItemLabel,
		id: string
	): { title: string; addon?: FormLabelAddonProps } => {
		if (typeof label === "string") {
			return {
				title: label,
			};
		} else if (!!label && typeof label === "object" && label.mainLabel) {
			return {
				title: label.mainLabel,
				addon: label.hint?.content
					? /* eslint-disable indent */
					  {
							type: "popover",
							content: <Sanitize>{label.hint?.content}</Sanitize>,
							"data-testid": id + "-popover",
					  }
					: /* eslint-enable indent */
					  undefined,
			};
		}
	};
}
