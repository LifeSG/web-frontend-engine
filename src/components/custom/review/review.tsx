import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import * as Yup from "yup";
import { Wrapper } from "../../elements/wrapper";
import { IGenericCustomFieldProps } from "../types";
import { IReviewSchema } from "./types";
import { useValidationConfig } from "../../../utils/hooks";
import { useEffect } from "react";

export const Review = (props: IGenericCustomFieldProps<IReviewSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		id,
		schema: { label, description, items, topSection, bottomSection, ...otherSchema },
	} = props;
	const { setFieldValidationConfig } = useValidationConfig();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		// set validation config so frontend engine's first onChange event can be fired
		setFieldValidationConfig(id, Yup.mixed());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

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
