import { V2_Color } from "@lifesg/react-design-system/v2_color";
import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";
import styled from "styled-components";
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
							content: <StyledHint className="label-hint">{label.hint?.content}</StyledHint>,
							"data-testid": id + "-popover",
					  }
					: /* eslint-enable indent */
					  undefined,
			};
		}
	};
}

const StyledHint = styled(Sanitize)`
	&.label-hint {
		color: ${V2_Color.Neutral[1]};
	}
`;
