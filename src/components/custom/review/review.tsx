import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import { Wrapper } from "../../elements/wrapper";
import { IGenericCustomFieldProps } from "../types";
import { IReviewSchema } from "./types";

export const Review = (props: IGenericCustomFieldProps<IReviewSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { label, description, items, topSection, bottomSection, ...otherSchema },
	} = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const generateSection = (sectionSchema: IReviewSchema["topSection"] | IReviewSchema["bottomSection"]) => {
		if (!sectionSchema) return undefined;

		return <Wrapper>{sectionSchema}</Wrapper>;
	};
	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<UneditableSection
			{...otherSchema}
			id={id}
			title={label}
			description={description}
			items={items}
			topSection={generateSection(topSection)}
			bottomSection={generateSection(bottomSection)}
		/>
	);
};
