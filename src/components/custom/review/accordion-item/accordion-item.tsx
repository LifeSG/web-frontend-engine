import { Layout } from "@lifesg/react-design-system/layout";
import { IReviewSchemaAccordionItem } from "../types";
import { AccordionLabel, AccordionValue, Eye, EyeSlash } from "./accordion-item.styles";
import { useState } from "react";
import { TestHelper } from "../../../../utils";

interface IProps extends IReviewSchemaAccordionItem {
	id: string;
}

const MASK_REPLACEMENT = "•";

export const AccordionItem = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, label, value, displayWidth, mask } = props;
	const [masked, toggleMask] = useState(true);

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderMaskedValue = (value: string, mask: IReviewSchemaAccordionItem["mask"]) => {
		const Icon = masked ? Eye : EyeSlash;
		let maskedValue = value;
		if (masked) {
			if (mask === "uinfin") {
				maskedValue = value.replace(/[STFGM]\d{7}[A-Z]/gi, (uinfinMatch) => {
					const digitsToMask = uinfinMatch.substring(1, 5);
					return uinfinMatch.replace(digitsToMask, MASK_REPLACEMENT.repeat(4));
				});
			} else if (mask === "whole") {
				maskedValue = value.replace(/./gi, MASK_REPLACEMENT);
			}
		}
		return (
			<>
				<span>{maskedValue}</span>
				<Icon
					onClick={() => toggleMask(!masked)}
					data-testid={TestHelper.generateId(id, masked ? "eye" : "eye-slash")}
				/>
			</>
		);
	};

	return (
		<Layout.ColDiv
			desktopCols={displayWidth === "full" ? 12 : 6}
			tabletCols={displayWidth === "full" ? 8 : 4}
			mobileCols={4}
		>
			<AccordionLabel>{label}</AccordionLabel>
			<AccordionValue>{!mask ? value : renderMaskedValue(value, mask)}</AccordionValue>
		</Layout.ColDiv>
	);
};
