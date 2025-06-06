import { Color } from "@lifesg/react-design-system/color";
import { FormLabelAddonProps } from "@lifesg/react-design-system/form/types";
import styled from "styled-components";
import { Wrapper } from "../../elements/wrapper";
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
			const content =
				typeof label.hint.content === "string" ? (
					<StyledHint className="label-hint">{label.hint.content}</StyledHint>
				) : (
					<Wrapper>{label.hint.content}</Wrapper>
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

const StyledHint = styled(Sanitize)`
	&.label-hint {
		color: ${Color.Neutral[1]};
	}
`;
