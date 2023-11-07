import { BoxContainer, Button } from "@lifesg/react-design-system";
import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import { useEffect } from "react";
import * as Yup from "yup";
import { useFieldEvent, useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { IGenericCustomElementProps } from "../types";
import { IReviewSchema } from "./types";

export const Review = (props: IGenericCustomElementProps<IReviewSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();
	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		// set validation config so frontend engine's first onChange event can be fired
		dispatchFieldEvent("mount", id);
		setFieldValidationConfig(id, Yup.mixed());
		return () => {
			removeFieldValidationConfig(id);
		};
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
	if (schema.variant === "accodion") {
		const {
			label,
			description,
			items,
			topSection,
			bottomSection,
			button,
			title,
			expanded,
			collapsible,
			...otherSchema
		} = schema;
		return (
			<BoxContainer
				id={id}
				data-testid={id}
				title={title}
				expanded={expanded}
				collapsible={collapsible}
				callToActionComponent={
					<Button.Default
						styleType="light"
						type="button"
						onClick={() => {
							dispatchFieldEvent("button-click", id);
						}}
					>
						{button?.label ?? "Edit"}
					</Button.Default>
				}
			>
				<UneditableSection
					{...otherSchema}
					id={id}
					title={label}
					description={description}
					items={items}
					topSection={generateSection(topSection)}
					bottomSection={generateSection(bottomSection)}
				/>
			</BoxContainer>
		);
	}

	const { label, description, items, topSection, bottomSection, ...otherSchema } = schema;

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
