import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { IArrayFieldSchema } from "../../../components/custom";
import { IFrontendEngineRef, TFrontendEngineFieldSchema } from "../../../components/types";
import {
	CommonCustomStoryWithoutLabelProps,
	DefaultStoryTemplate,
	FrontendEngine,
	OVERRIDES_ARG_TYPE,
	OverrideStoryTemplate,
	ResetStoryTemplate,
	SUBMIT_BUTTON_SCHEMA,
	WarningStoryTemplate,
} from "../../common";
import { ReactElement, useRef } from "react";
import { Button } from "@lifesg/react-design-system";
import { RecursivePartial } from "../../../utils";

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
		style: { marginTop: 16, marginBottom: 16, border: "2px solid black", padding: 16 },
		children: {
			description: {
				uiType: "text-body",
				children: [
					"This array field has custom error apply for the first and the third element.",
					"Nested array in the first element has the custom error for the first and third entries.",
				],
				columns: { mobile: 4, tablet: 8, desktop: 12 },
			},
			name: {
				uiType: "text-field",
				label: "Name",
				columns: { mobile: 4, tablet: 8, desktop: 12 },
				validation: [{ required: true }],
			},
			email: {
				uiType: "email-field",
				label: "Email",
				columns: { mobile: 4, tablet: 4, desktop: 6 },
			},
			uinfin: {
				uiType: "masked-field",
				label: "Uinfin",
				columns: { mobile: 4, tablet: 4, desktop: 6 },
			},
			wrapper: {
				uiType: "div",
				style: {
					padding: "1rem",
					borderRadius: 4,
					border: `1px solid #E0E4E5`,
				},
				columns: { mobile: 4, tablet: 8, desktop: 12 },
				children: {
					testArray: {
						referenceKey: "array-field",
						sectionTitle: "Nested array",
						columns: { mobile: 4, tablet: 8, desktop: 12 },
						fieldSchema: {
							grid: {
								uiType: "grid",
								children: {
									childName: {
										uiType: "text-field",
										label: "Child name",
										columns: { mobile: 4, tablet: 8, desktop: 12 },
										validation: [{ required: true }],
									},
									childEmail: {
										uiType: "email-field",
										label: "Child email",
										columns: { mobile: 4, tablet: 4, desktop: 6 },
									},
									childUinfin: {
										uiType: "masked-field",
										label: "Child uinfin",
										columns: { mobile: 4, tablet: 4, desktop: 6 },
									},
								},
							},
						},
					},
				},
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

const CustomErrorStory = <T,>(id: string, showSubmitButton = true) =>
	(({ overrides, ...args }) => {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		const formRef = useRef<IFrontendEngineRef>();
		const handleTriggeredError = () => {
			try {
				throw {
					[id]: {
						fields: [
							{
								name: "Custom error",
								email: "Custom error",
								uinfin: "Custom error",
								testArray: {
									fields: [
										{
											childName: "Custom error",
											childEmail: "Custom error",
											childUinfin: "Custom error",
										},
										undefined,
										{
											childName: "Custom error",
											childEmail: "Custom error",
											childUinfin: "Custom error",
										},
									],
									errorMessage: "Nested array field error message",
								},
							},
							undefined,
							{
								name: "Custom error",
								email: "Custom error",
								uinfin: "Custom error",
								testArray: {
									fields: [
										{
											childName: "Custom error",
											childEmail: "Custom error",
											childUinfin: "Custom error",
										},
									],
								},
							},
						],
						errorMessage: "Array field error message",
					},
				};
			} catch (error) {
				formRef.current.setErrors(error);
			}
		};
		return (
			<>
				<FrontendEngine
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[id]: args as unknown as TFrontendEngineFieldSchema,
									...(showSubmitButton && { ...SUBMIT_BUTTON_SCHEMA }),
								},
							},
						},
						...(!!overrides && {
							overrides: {
								[id]: overrides,
							},
						}),
					}}
					ref={formRef}
				/>
				<Button.Default onClick={handleTriggeredError} style={{ marginTop: "2rem" }}>
					Triggered error message
				</Button.Default>
			</>
		);
	}) as StoryFn<(args: T & { overrides?: RecursivePartial<T> | undefined }) => ReactElement>;

export const CustomError = CustomErrorStory<IArrayFieldSchema>("array-field-custom-error").bind({});
CustomError.args = {
	referenceKey: "array-field",
	sectionTitle: "New fruit",
	fieldSchema: SCHEMA_NESTED_ARRAY,
	overrides: {
		sectionTitle: "Custom Error",
	},
};
