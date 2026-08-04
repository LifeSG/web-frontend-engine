import { FormLabelAddonProps } from "@lifesg/react-design-system/form";
import { Wrapper } from "../../elements/wrapper";
import { Sanitize } from "../../shared";
import { IFilterItemLabel } from "./types";
import * as styles from "./filter-helper.styles";

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
			const content =
				typeof label.hint?.content === "string" ? (
					<Sanitize className={styles.labelHint}>{label.hint.content}</Sanitize>
				) : (
					<Wrapper>{label.hint?.content}</Wrapper>
				);
			return {
				title: label.mainLabel,
				addon: label.hint?.content
					? /* eslint-disable indent */
					  {
							type: "popover",
							content,
							zIndex: label.hint?.zIndex,
							"data-testid": id + "-popover",
					  }
					: /* eslint-enable indent */
					  undefined,
			};
		}
	};
}
