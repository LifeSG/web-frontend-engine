import { BoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@lifesg/react-design-system/button";
import { Layout } from "@lifesg/react-design-system/layout";
import { Text } from "@lifesg/react-design-system/text";
import { UneditableSection, UneditableSectionItemProps } from "@lifesg/react-design-system/uneditable-section";
import { useEffect } from "react";
import * as Yup from "yup";
import { useFieldEvent, useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { IGenericCustomElementProps } from "../types";
import { AccordionLabel, AccordionLayout } from "./review.styles";
import { IReviewSchema, IReviewSchemaAccordion, IReviewSchemaBox } from "./types";

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
	const generateSection = (sectionSchema: IReviewSchemaBox["topSection"] | IReviewSchemaBox["bottomSection"]) => {
		if (!sectionSchema) return undefined;

		return <Wrapper>{sectionSchema}</Wrapper>;
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	const renderAccordion = (schema: IReviewSchemaAccordion) => {
		const { items, button, expanded = true, label, ...otherSchema } = schema;
		return (
			<BoxContainer
				title={label}
				callToActionComponent={
					<Button.Default styleType="light" type="button" onClick={() => dispatchFieldEvent("edit", id)}>
						{button?.label ?? "Edit"}
					</Button.Default>
				}
				expanded={expanded}
				{...otherSchema}
			>
				<AccordionLayout type="grid">{items.map(renderAccordionItem)}</AccordionLayout>
			</BoxContainer>
		);
	};

	const renderAccordionItem = ({ label, value, displayWidth }: UneditableSectionItemProps, counter: number) => {
		return (
			<Layout.ColDiv
				desktopCols={displayWidth === "full" ? 12 : 6}
				tabletCols={displayWidth === "full" ? 8 : 4}
				mobileCols={4}
				key={counter}
			>
				<AccordionLabel>{label}</AccordionLabel>
				<Text.Body>{value}</Text.Body>
			</Layout.ColDiv>
		);
	};

	const renderBox = (schema: IReviewSchemaBox) => {
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

	return schema.variant === "accordion" ? renderAccordion(schema) : renderBox(schema);
};
