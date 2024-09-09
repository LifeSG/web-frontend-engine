import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { IArrayFieldSchema } from "../../../components/custom";
import { TFrontendEngineFieldSchema } from "../../../components/types";
import {
	CommonCustomStoryWithoutLabelProps,
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

export const Default = DefaultStoryTemplate<IArrayFieldSchema>("array-field-default").bind({});
Default.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
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

export const CopyCustomisation = DefaultStoryTemplate<IArrayFieldSchema>("array-field-copy-customisation").bind({});
CopyCustomisation.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA,
	addButton: { label: "Add fruit", icon: "CalendarPlusFillIcon" },
	removeButton: { label: "Remove fruit", icon: "CalendarCrossFillIcon" },
	removeConfirmationModal: { title: "Remove fruit?" },
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
