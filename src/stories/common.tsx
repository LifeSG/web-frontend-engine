import { Button } from "@lifesg/react-design-system/button";
import { action } from "@storybook/addon-actions";
import { ArgTypes, StoryFn } from "@storybook/react";
import { ReactElement, Ref, forwardRef, useRef } from "react";
import styled from "styled-components";
import { IFrontendEngineProps, IYupValidationRule, FrontendEngine as OriginalFrontendEngine } from "../components";
import { IResetButtonSchema, ISubmitButtonSchema } from "../components/fields";
import { IFrontendEngineRef, TFrontendEngineFieldSchema } from "../components/frontend-engine";
import { RecursivePartial, TNoInfer } from "../utils";
import { Breakpoint, MediaQuery } from "@lifesg/react-design-system/theme";

const EXCLUDED_STORY_PROPS: ArgTypes = {
	invalid: { table: { disable: true } },
	isTouched: { table: { disable: true } },
	isDirty: { table: { disable: true } },
	error: { table: { disable: true } },
	onChange: { table: { disable: true } },
	onBlur: { table: { disable: true } },
	value: { table: { disable: true } },
	name: { table: { disable: true } },
};

export const CommonFieldStoryProps = (uiType: string, isElement = false): ArgTypes => {
	if (isElement) {
		return {
			...EXCLUDED_STORY_PROPS,
			...COLUMNS_ARG_TYPE,
			uiType: {
				description: `Use <code>${uiType}</code> to show this field`,
				table: {
					type: {
						summary: "string",
					},
				},
				type: { name: "string", required: true },
				options: [uiType],
				control: {
					type: "select",
				},
				defaultValue: uiType,
			},
		};
	}
	return {
		...EXCLUDED_STORY_PROPS,
		...COLUMNS_ARG_TYPE,
		uiType: {
			description: `Use <code>${uiType}</code> to show this field`,
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: [uiType],
			control: {
				type: "select",
			},
		},
		label: {
			description: `A name/description of the purpose of the form element which may include an optional sub-label and popover feature.<br>
				If string is provided, the entire label will be rendered.<br>If object is provided:
				<ul>
					<li>mainLabel: Primary text to display.</li>
					<li>subLabel: Secondary text to display below the mainLabel.</li>
					<li>hint.content: Displays an info icon and brings up the content as a popover on click.</li>
				</ul>
			`,
			table: {
				type: {
					summary:
						"string | { mainLabel: string, subLabel?: string, hint?: { content: string; zIndex?: number } }",
				},
			},
		},
		validation: {
			description:
				"A set of config to ensure the value is acceptable before submission. For more info, refer to the <a href='../?path=/docs/form-validation-schema--required'>Validation Schema</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object", value: {} },
			defaultValue: [],
		},
		showIf: {
			description:
				"A set of conditions to render the field. For more info, refer to the <a href='../?path=/docs/form-conditional-rendering-rules--filled'>Conditional Rendering</a> stories",
			table: {
				type: {
					summary: "array",
				},
			},
			type: { name: "object", value: {} },
			defaultValue: [],
		},
	};
};

export const CommonCustomStoryProps = (referenceKey: string): ArgTypes => {
	return {
		referenceKey: {
			description: `Use <code>${referenceKey}</code> to show this field`,
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: [referenceKey],
			control: {
				type: "select",
			},
			defaultValue: referenceKey,
		},
		label: {
			description: "A name/description of the purpose of the element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		...COLUMNS_ARG_TYPE,
	};
};
export const CommonCustomStoryWithoutLabelProps = (referenceKey: string): ArgTypes => {
	return {
		referenceKey: {
			description: `Use <code>${referenceKey}</code> to show this field`,
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: true },
			options: [referenceKey],
			control: {
				type: "select",
			},
			defaultValue: referenceKey,
		},
		...COLUMNS_ARG_TYPE,
	};
};

export const COLUMNS_ARG_TYPE: ArgTypes = {
	columns: {
		description: `Specifies the number of columns to be span across in desktop / tablet / mobile viewports. If an array is specified, the format is as such <code>[startCol, endCol]</code>.<br><br>
		The system automatically determines which grid layout to use based on the properties you provide:<br>
		V2 Grid System is applied when you use <code>desktop, tablet, or mobile</code> properties<br>
		V3 Grid System is applied when you use any of the properties <code>xxs, xs, sm, md, lg, xl, or xxl</code><br><br>
		For <code>v2</code> version:<br>
		Permitted values:<br>
		Desktop: <code>1 - 12</code> and <code>1 - 13</code> if specifying a range.<br>Mobile: <code>1 - 4</code> and <code>1 - 5</code> if specifying a range.<br><br>
		Settings are applied by similar to how <code>@max-width</code> works: if <code>desktop</code> is not specified, <code>tablet</code> will be used for desktop and tablet, if <code>tablet</code> is also not specified, <code>mobile</code> will be used for all screen sizes.<br><br>
		If all column settings are not specified, element will span across a single column.<br><br>
		For <code>v3</code> version:<br>
		Permitted values:<br>
		xxs-md: <code>1-8</code> or <code>1-9</code> if specifying a range.<br>
		lg-xxl: <code>1-12</code> or <code>1-13</code> if specifying a range.<br><br>
		Settings are applied by similar to how <code>@max-width</code> works: if <code>lg-xxl</code> is not specified, <code>xxs-md</code> will be used for all screen sizes.<br><br>
		If all column settings are not specified, element will span across a single column.<br><br>`,
		table: {
			type: {
				summary: `v2: {desktop?: number, tablet?: number, mobile?: number} | v3: {xxs?: number, xs?: number, sm?: number, md?: number, lg?: number, xl?: number, xxl?: number}`,
			},
		},
		defaultValue: { desktop: 12 },
		control: { type: "object" },
	},
};

export const OVERRIDES_ARG_TYPE: ArgTypes = {
	overrides: {
		description: "Applies field schema properties on-the-fly over the schema without modifying `sections`",
		table: {
			type: {
				summary: "Record<string, RecursivePartial<TFrontendEngineFieldSchema<V>>>",
			},
		},
		type: { name: "object", value: {} },
	},
};

export const SUBMIT_BUTTON_SCHEMA: Record<string, ISubmitButtonSchema> = {
	"submit-button": { uiType: "submit", label: "Submit", className: "margin-bottom-1" },
};
export const RESET_BUTTON_SCHEMA: Record<string, IResetButtonSchema> = {
	"reset-button": { uiType: "reset", label: "Reset", className: "margin-bottom-1" },
};

const MINIMUM_SIDE_PADDING = 48;
const SIDEBAR_WIDTH = 210;
const SPACER = 550;

const StyledForm = styled(OriginalFrontendEngine)`
	width: calc(${Breakpoint["xl-max"]}px - ${MINIMUM_SIDE_PADDING + SIDEBAR_WIDTH + SPACER}px);
	max-width: 820px;

	${MediaQuery.MaxWidth.xl} {
		min-width: 500px;
		width: calc(${Breakpoint["xl-max"]}px - ${MINIMUM_SIDE_PADDING + SIDEBAR_WIDTH + SPACER}px);
	}

	${MediaQuery.MaxWidth.lg} {
		min-width: 400px;
		width: calc(${Breakpoint["lg-max"]}px - ${MINIMUM_SIDE_PADDING + SIDEBAR_WIDTH + SPACER}px);
	}

	${MediaQuery.MaxWidth.sm} {
		min-width: 350px;
		width: calc(${Breakpoint["sm-max"]}px - ${MINIMUM_SIDE_PADDING + SPACER}px);
	}

	${MediaQuery.MaxWidth.xs} {
		min-width: 0;
		width: calc(${Breakpoint["xs-max"]}px - ${MINIMUM_SIDE_PADDING}px);
	}

	${MediaQuery.MaxWidth.xxs} {
		width: calc(${Breakpoint["xs-max"]}px - ${MINIMUM_SIDE_PADDING}px);
	}
`;

// naming it as `FrontendEngine` because this is shown in code view
export const FrontendEngine = forwardRef<IFrontendEngineRef, IFrontendEngineProps>((props, ref) => (
	<StyledForm
		onValueChange={(values, isValid) => action("valueChange")(values, isValid)}
		onSubmit={(e) => action("submit")(e)}
		ref={ref}
		{...props}
	/>
)) as <V = undefined, C = undefined>(
	props: IFrontendEngineProps<TNoInfer<V, IYupValidationRule>, C> & { ref?: Ref<IFrontendEngineRef> }
) => ReactElement;

export const LOREM_IPSUM = (prefix: string) => {
	const codePrefix = `<code>${prefix}</code>`;

	return `${prefix && codePrefix + " : "}Lorem ipsum dolor sit`;
};

/**
 * Default story template that contains the component and a submit button
 *
 * &lt;T&gt; generic: component schema definition
 *
 * &lt;U&gt; generic: default value typing
 */
export const DefaultStoryTemplate = <T, U = string>(id: string, hideSubmit = false) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args as unknown as TFrontendEngineFieldSchema,
							...(!hideSubmit ? SUBMIT_BUTTON_SCHEMA : {}),
						},
					},
				},
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as StoryFn<(args: T & { defaultValues?: U | undefined }) => ReactElement>;

/**
 * Story template that contains the component, a reset button and a submit button
 *
 * &lt;T&gt; generic: component schema definition
 *
 * &lt;U&gt; generic: default value typing
 */
export const ResetStoryTemplate = <T, U = string>(id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args as unknown as TFrontendEngineFieldSchema,
							buttons: {
								uiType: "div",
								style: { display: "flex", gap: "1rem" },
								children: {
									...RESET_BUTTON_SCHEMA,
									...SUBMIT_BUTTON_SCHEMA,
								},
							},
						},
					},
				},
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as StoryFn<(args: T & { defaultValues?: U | undefined }) => ReactElement>;

/**
 * Story template that contains the component, a submit button and an override button
 *
 * &lt;T&gt; generic: component schema definition
 */
export const OverrideStoryTemplate = <T,>(id: string, showSubmitButton = true) =>
	(({ overrides, ...args }) => {
		return (
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
			/>
		);
	}) as StoryFn<(args: T & { overrides?: RecursivePartial<T> | undefined }) => ReactElement>;

/**
 * Story template that contains the component and a button trigger warning
 *
 * &lt;T&gt; generic: component schema definition
 */
export const WarningStoryTemplate = <T,>(id: string) =>
	((args) => {
		return <FrontendEngineWithWarning id={id} fieldSchema={args as unknown as TFrontendEngineFieldSchema} />;
	}) as StoryFn<(args: T & { overrides?: RecursivePartial<T> | undefined }) => ReactElement>;

const FrontendEngineWithWarning = ({ id, fieldSchema }: { id: string; fieldSchema: TFrontendEngineFieldSchema }) => {
	const formRef = useRef<IFrontendEngineRef>(null);

	return (
		<>
			<FrontendEngine
				ref={formRef}
				data={{
					sections: {
						section: {
							uiType: "section",
							children: {
								[id]: fieldSchema,
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
				}}
			/>
			<Button.Default
				onClick={() =>
					formRef.current?.setWarnings({
						[id]: "This is a warning message, it is set via `setWarnings()` from Frontend Engine.",
					})
				}
				style={{ marginTop: "2rem" }}
			>
				Show warning
			</Button.Default>
		</>
	);
};
