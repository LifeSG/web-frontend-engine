import { BoxContainer } from "@lifesg/react-design-system/box-container";
import { Button } from "@lifesg/react-design-system/button";
import { UneditableSection } from "@lifesg/react-design-system/uneditable-section";
import { useEffect } from "react";
import styled from "styled-components";
import * as Yup from "yup";
import { useFieldEvent, useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { IGenericCustomElementProps } from "../types";
import { IReviewSchema, IReviewSchemaAccordion, IReviewSchemaDefault } from "./types";

const UneditableSectionCustom = styled(UneditableSection)`
	background-color: transparent;
	padding-left: 2rem;
	padding-right: 2rem;
`;
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
		const { items, button, label, ...otherSchema } = schema;
		return (
			<BoxContainer
				title={label}
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
				{...otherSchema}
			>
				<UneditableSectionCustom id={id} items={items} />
			</BoxContainer>
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
