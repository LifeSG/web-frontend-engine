import { Form } from "@lifesg/react-design-system/form";
import { Layout } from "@lifesg/react-design-system/layout";
import { Typography } from "@lifesg/react-design-system/typography";
import { action } from "@storybook/addon-actions";
import highlightjs from "highlight.js";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/monokai.css";
import cloneDeep from "lodash/cloneDeep";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
	FrontendEngine,
	IFrontendEngineData,
	TFrontendEngineFieldSchema,
	TFrontendEngineValues,
} from "../../../components";
import { Sanitize } from "../../../components/shared";
import { IYupValidationRule } from "../../../context-providers";
import { SUBMIT_BUTTON_SCHEMA } from "../../common";
import { ALL_VALIDATION_DEMO_FIELD_IDS, TValidationDemoFieldIds, VALIDATION_DEMO_CONFIGS } from "./validation.data";
import { Font } from "@lifesg/react-design-system";

highlightjs.registerLanguage("json", json);

export interface IValidationStoryComponentProps {
	info: {
		/** rule displayed in the story / applied to field */
		rule: IYupValidationRule;
		/** name of the rule */
		ruleName: string;
		/** detailed functionality of the rule */
		ruleDescription: string;
	};
	/** Frontend Engine fields to include in example */
	fields?: TValidationDemoFieldIds[] | undefined;
	/** field to show by default */
	defaultField?: TValidationDemoFieldIds | undefined;
	/** Frontend Engine fields to exclude from example */
	excludeFields?: TValidationDemoFieldIds[] | undefined;
	overrides?:
		| {
				/** field types to override */
				for?: TValidationDemoFieldIds[] | undefined;
				/** rule to override */
				rule?: IYupValidationRule | undefined;
				/** frontend engine schema to override */
				schema?: Record<string, TFrontendEngineFieldSchema> | undefined;
				/** prefill values */
				defaultValues?: TFrontendEngineValues | undefined;
		  }[]
		| undefined;
}

export const ValidationStoryComponent = ({
	info: { rule, ruleDescription, ruleName },
	fields,
	defaultField,
	excludeFields = [],
	overrides,
}: IValidationStoryComponentProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const fieldTypes = fields || ALL_VALIDATION_DEMO_FIELD_IDS;
	const [demoFieldType, setDemoField] = useState<TValidationDemoFieldIds>(defaultField || "textField");
	const ruleSnippet = useRef(null);
	const exampleSnippet = useRef(null);
	const fieldOptions = Object.entries(VALIDATION_DEMO_CONFIGS).reduce((acc, [key, fieldSchema]) => {
		if (
			!excludeFields.includes(key as TValidationDemoFieldIds) &&
			fieldTypes.includes(key as TValidationDemoFieldIds) &&
			"label" in fieldSchema
		) {
			acc.push({ label: fieldSchema.label, value: key });
		}
		return acc;
	}, []);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		highlightjs.highlightBlock(ruleSnippet.current);
		highlightjs.highlightBlock(exampleSnippet.current);
	}, [demoFieldType]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const overrideRule = () => {
		if (!overrides) return {};
		const overrideRule = overrides.find(({ for: fieldTypes }) => fieldTypes.includes(demoFieldType));
		if (!overrideRule) return {};
		return overrideRule.rule || {};
	};

	const overrideSchema = () => {
		if (!overrides) return {};
		const overrideSchema = overrides.find(({ for: fieldTypes }) => fieldTypes.includes(demoFieldType));
		if (!overrideSchema) return {};
		return overrideSchema.schema || {};
	};

	const overrideDefaultValues = () => {
		if (!overrides) return {};
		const overrideDefaultValues = overrides.find(({ for: fieldTypes }) => fieldTypes.includes(demoFieldType));
		if (!overrideDefaultValues) return {};
		return overrideDefaultValues.defaultValues || {};
	};

	const generateSchema = () => {
		return {
			sections: {
				section: {
					uiType: "section",
					children: {
						field: {
							...VALIDATION_DEMO_CONFIGS[demoFieldType],
							validation: [{ ...cloneDeep(rule), ...overrideRule() }],
						},
						...overrideSchema(),
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
			defaultValues: overrideDefaultValues(),
		};
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Wrapper>
			<Layout.Content type="grid">
				<Layout.ColDiv lgCols={12} xxsCols={8}>
					<Section>
						<SectionTitle as={Typography.HeadingSM}>{ruleName}</SectionTitle>
						<Sanitize>{ruleDescription}</Sanitize>
						<pre>
							<code ref={ruleSnippet} key={demoFieldType} className="json">
								{JSON.stringify({ ...rule, ...overrideRule() }, null, 2)}
							</code>
						</pre>
					</Section>
				</Layout.ColDiv>
				<Layout.ColDiv xxsCols={8} lgCols={6}>
					<Section>
						<SectionTitle as={Typography.BodyMD}>Sample schema</SectionTitle>
						<div>
							<Form.Select
								options={fieldOptions}
								variant="small"
								enableSearch
								displayValueExtractor={({ label }) => label}
								valueExtractor={({ value }) => value}
								listExtractor={({ label }) => label}
								onSelectOption={({ value }) => setDemoField(value)}
								selectedOption={fieldOptions.find(({ value }) => value === demoFieldType)}
							/>
						</div>
						<pre>
							<code ref={exampleSnippet} key={demoFieldType} className="json">
								{JSON.stringify(generateSchema(), null, 2)}
							</code>
						</pre>
					</Section>
				</Layout.ColDiv>
				<Layout.ColDiv xxsCols={8} lgCols={6}>
					<Section>
						<SectionTitle as={Typography.BodyMD}>Preview</SectionTitle>
						<p>Submit form to preview validation</p>
						<FrontendEngine
							key={demoFieldType}
							onValueChange={(values, isValid) => action("valueChange")(values, isValid)}
							onSubmit={(e) => action("submit")(e)}
							data={generateSchema() as IFrontendEngineData}
						/>
					</Section>
				</Layout.ColDiv>
			</Layout.Content>
		</Wrapper>
	);
};

const Wrapper = styled.div`
	max-width: 90vw;

	code {
		border-radius: 4px;
	}
`;

const Section = styled.section`
	display: flex;
	flex-direction: column;
	gap: 0.5rem;
	margin-bottom: 2rem;
	padding: 1.25rem;

	// follow storybook styling
	border: 1px solid rgba(38, 85, 115, 0.15);
	border-radius: 4px;
	box-shadow: rgba(0, 0, 0, 0.1) 0 1px 3px 0;
`;

const SectionTitle = styled.div`
	font-weight: ${Font.Spec["weight-bold"]};
`;
