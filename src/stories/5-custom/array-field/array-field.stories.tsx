import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IArrayFieldSchema } from "../../../components/custom";
import { TFrontendEngineFieldSchema } from "../../../components/types";
import {
	CommonCustomStoryWithoutLabelProps,
	CustomErrorStoryTemplate,
	DefaultStoryTemplate,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	WarningStoryTemplate,
} from "../../common";

const meta: Meta = {
	title: "Custom/ArrayField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ArrayField</Title>
					<p>This component allows users to add multiple items in a list.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonCustomStoryWithoutLabelProps("array-field"),
		fieldSchema: {
			description:
				"Elements or string that is the descendant of this component. Only accepts FilterItem or FilterCheckbox.",
			table: {
				type: {
					summary: "Record<string, TFrontendEngineFieldSchema>",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
		sectionTitle: {
			description: "The title shown at the top of each section",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		sectionInset: {
			description:
				"The inset for each section. Accepts a number (px) or css value such as `1rem`. For layouts where the divider needs to span the full parent width",
			table: {
				type: {
					summary: "number | string",
				},
			},
		},
		showDivider: {
			description: "Specifies if a divider is rendered between each section",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: "true" },
			},
		},
		addButton: {
			description: `Customisation options for the add button<br/>
				<ul>
					<li>\`label\` prop overrides the text</li>
					<li>\`icon\` prop overrides the icon, based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page' target='_blank' rel='noopener noreferrer'>React Icons</a></li>
				</ul>
			`,

			table: {
				type: {
					summary: "{ label?: string, icon?: string }",
				},
			},
		},
		removeButton: {
			description: `Customisation options for the remove button<br/>
				<ul>
					<li>\`label\` prop overrides the text</li>
					<li>\`icon\` prop sets the icon, based on <a href='https://designsystem.life.gov.sg/reacticons/index.html?path=/story/collection--page' target='_blank' rel='noopener noreferrer'>React Icons</a></li>
				</ul>
			`,
			table: {
				type: {
					summary: "{ label?: string, icon?: string }",
				},
			},
		},
		removeConfirmationModal: {
			description: `Customisation options for the confirmation modal when item is removed<br/>
				<ul>
					<li>\`title\` prop overrides the confirmation text title</li>
				</ul>
			`,

			table: {
				type: {
					summary: "{ title?: string }",
				},
			},
		},
	},
};
export default meta;

const SCHEMA: Record<string, TFrontendEngineFieldSchema> = {
	grid: {
		uiType: "grid",
		style: { marginTop: 16, marginBottom: 16 },
		children: {
			description: {
				uiType: "text-body",
				children: "Enter more details about this fruit",
				columns: { mobile: 4, tablet: 8, desktop: 12 },
			},
			name: {
				uiType: "text-field",
				label: "Name",
				columns: { mobile: 4, tablet: 8, desktop: 12 },
				validation: [{ required: true }],
			},
			colour: {
				uiType: "select",
				label: "Colour",
				options: [{ label: "Red", value: "Red" }],
				columns: { mobile: 4, tablet: 4, desktop: 6 },
			},
		},
	},
};

const SCHEMA_NESTED_ARRAY: Record<string, TFrontendEngineFieldSchema> = {
	grid: {
		uiType: "grid",
		style: { marginTop: 16, marginBottom: 16 },
		children: {
			description: {
				uiType: "text-body",
				children: "This array field has custom error apply for the first and the third element",
				columns: { mobile: 4, tablet: 8, desktop: 12 },
			},
			name: {
				uiType: "text-field",
				label: "Name",
				columns: { mobile: 4, tablet: 8, desktop: 12 },
				validation: [{ required: true }],
			},
			color: {
				uiType: "select",
				label: "Color",
				options: [{ label: "Red", value: "Red" }],
				columns: { mobile: 4, tablet: 4, desktop: 6 },
			},
			testArray: {
				referenceKey: "array-field",
				sectionTitle: "Nested array",
				columns: { mobile: 4, tablet: 8, desktop: 12 },
				fieldSchema: {
					grid: {
						uiType: "grid",
						style: { marginTop: 16, marginBottom: 16 },
						children: {
							name: {
								uiType: "text-field",
								label: "Name",
								columns: { mobile: 4, tablet: 8, desktop: 12 },
								validation: [{ required: true }],
							},
							color: {
								uiType: "select",
								label: "Color",
								options: [{ label: "Red", value: "Red" }],
								columns: { mobile: 4, tablet: 4, desktop: 6 },
							},
						},
					},
				},
				validation: [{ max: 1, min: 1 }],
			},
		},
	},
};

export const Default = DefaultStoryTemplate<IArrayFieldSchema>("array-field-default").bind({});
Default.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
};

export const DefaultValue = DefaultStoryTemplate<IArrayFieldSchema, object[]>("array-field-default-value").bind({});
DefaultValue.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	defaultValues: [{ name: "Apple", colour: "Red" }, { name: "Berry" }],
};
DefaultValue.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "object[]",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const WithValidation = DefaultStoryTemplate<IArrayFieldSchema>("array-field-with-validation").bind({});
WithValidation.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	validation: [{ required: true }],
};

export const Max = DefaultStoryTemplate<IArrayFieldSchema>("array-field-max").bind({});
Max.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	validation: [{ max: 2 }],
};

export const Min = DefaultStoryTemplate<IArrayFieldSchema>("array-field-min").bind({});
Min.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	validation: [{ min: 2 }],
};

export const FixedLength = DefaultStoryTemplate<IArrayFieldSchema>("array-field-fixed-length").bind({});
FixedLength.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	validation: [{ length: 2 }],
};

export const Customisation = DefaultStoryTemplate<IArrayFieldSchema>("array-field-customisation").bind({});
Customisation.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	addButton: { label: "Add fruit", icon: "CalendarPlusFillIcon" },
	removeButton: { label: "Remove fruit", icon: "CalendarCrossFillIcon" },
	removeConfirmationModal: { title: "Remove fruit?" },
	sectionInset: "1rem",
};

export const HideDivider = DefaultStoryTemplate<IArrayFieldSchema>("array-field-hide-divider").bind({});
HideDivider.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	showDivider: false,
	fieldSchema: SCHEMA,
};

export const Warning = WarningStoryTemplate<IArrayFieldSchema>("array-field-with-warning").bind({});
Warning.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
};

export const Reset = ResetStoryTemplate<IArrayFieldSchema>("array-field-reset").bind({});
Reset.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
};

export const ResetWithDefaultValues = ResetStoryTemplate<IArrayFieldSchema, any[]>(
	"array-field-reset-default-values"
).bind({});
ResetWithDefaultValues.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	defaultValues: [{ name: "Apple" }, { name: "Berry" }],
};
ResetWithDefaultValues.argTypes = {
	defaultValues: {
		description: "Default value for the field, this is declared outside `sections`",
		table: {
			type: {
				summary: "string",
			},
		},
	},
};

export const Overrides = OverrideStoryTemplate<IArrayFieldSchema>("array-field-overrides").bind({});
Overrides.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	overrides: {
		sectionTitle: "Overridden",
	},
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const CustomError = CustomErrorStoryTemplate<IArrayFieldSchema>("array-field-custom-error").bind({});
CustomError.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA_NESTED_ARRAY,
	overrides: {
		sectionTitle: "Custom Error",
	},
};
