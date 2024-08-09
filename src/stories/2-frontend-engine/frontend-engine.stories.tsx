import { Button } from "@lifesg/react-design-system/button";
import { Form } from "@lifesg/react-design-system/form";
import { Text } from "@lifesg/react-design-system/text";
import { action } from "@storybook/addon-actions";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { TCustomComponentProps, TCustomComponentSchema } from "../../components";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../components/frontend-engine";
import { TCustomComponent } from "../../context-providers";
import { useFrontendEngineComponent } from "../../utils/hooks";
import { FrontendEngine, RESET_BUTTON_SCHEMA, SUBMIT_BUTTON_SCHEMA } from "../common";

const meta: Meta = {
	title: "Form/Frontend Engine",
	component: FrontendEngine,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>FrontendEngine</Title>
					<p>The main component to render a form, based on a JSON schema through the `data` prop.</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		data: {
			description: "JSON configuration to define the fields and functionalities of the form",
			table: {
				type: {
					summary: "IFrontendEngineData",
				},
			},
			type: { name: "object", value: {}, required: true },
		},
		className: {
			description: "HTML class attribute that is applied on the `<form>` element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		components: {
			description:
				"Custom components defined outside Frontend Engine. Key denotes referenceKey in schema while value is the component to be used",
			table: {
				type: {
					summary: "TCustomComponents",
				},
			},
			type: { name: "object", value: {} },
		},
		"data.className": {
			description: "HTML class attribute that is applied on the `<form>` element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"data.defaultValues": {
			description:
				"Fields' initial values on mount. The key of each field needs to match the id used in the field.",
			table: {
				type: {
					summary: "TFrontendEngineValues",
				},
			},
		},
		"data.overrides": {
			description: "Applies field schema properties on-the-fly over the schema without modifying `sections`",
			table: {
				type: {
					summary: "Record<string, RecursivePartial<TFrontendEngineFieldSchema<V>>>",
				},
			},
		},
		"data.sections": {
			description: "All components within the form. For more info, refer to individual field stories.",
			table: {
				type: {
					summary: "Record<string, ISectionSchema>",
				},
			},
			control: {
				type: null,
			},
			type: { name: "object", value: {}, required: true },
		},
		"data.id": {
			description:
				"Unique HTML id attribute that is also used by the `data-testid`. Applied on the `<form>` element",
			table: {
				type: {
					summary: "string",
				},
			},
		},
		"data.revalidationMode": {
			description:
				"Validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event). Refer to React Hook Form's <a href='https://react-hook-form.com/api/useform/#props' target='_blank' rel='noopener noreferrer'>documentation</a> for more info.",
			table: {
				type: {
					summary: "TRevalidationMode",
					detail: "onChange | onBlur | onSubmit",
				},
				defaultValue: {
					summary: "onChange",
				},
			},
		},
		"data.validationMode": {
			description:
				"Validation strategy before a user submits the form (onSubmit event). Refer to React Hook Form's <a href='https://react-hook-form.com/api/useform/#props' target='_blank' rel='noopener noreferrer'>documentation</a> for more info.",
			table: {
				type: {
					summary: "TValidationMode",
					detail: "onBlur | onChange | onSubmit | onTouched | all",
				},
				defaultValue: {
					summary: "onTouched",
				},
			},
		},
		"data.restoreMode": {
			description:
				"Specifies how the value of a conditionally rendered field is populated when it is shown again.",
			table: {
				type: {
					summary: "TRestoreMode",
					detail: "none | default-value | user-input",
				},
				defaultValue: {
					summary: "none",
				},
			},
		},
		onChange: {
			description: "Fires on mount and every time the schema or value in any fields changes",
			table: {
				type: {
					summary: "(values: TFrontendEngineValues<any>, isValid?: boolean) => unknown",
				},
			},
		},
		onValueChange: {
			description: "Fires every time a value in any fields changes",
			table: {
				type: {
					summary: "(values: TFrontendEngineValues<any>, isValid?: boolean) => unknown",
				},
			},
		},
		onSubmit: {
			description: "Submit event handler, will receive the form data if form validation is successful",
			table: {
				type: {
					summary: "(values: TFrontendEngineValues) => unknown",
				},
			},
		},
		onSubmitError: {
			description:
				"Submit event handler for when form fails validation, will receive error fields and respective error messages",
			table: {
				type: {
					summary: "(values: TFrontendEngineValues) => unknown",
				},
			},
		},
		ref: {
			description: "Functions same as React refs, provides a way to access the component",
			table: {
				type: {
					summary: "Ref<IFrontendEngineRef>",
				},
			},
		},
		stripUnknown: {
			description:
				"Excludes values of fields that are not declared in the schema on submit / via getValues(). Note: Conditionally-hidden fields are never included in the form values.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "false",
				},
			},
			control: {
				type: "boolean",
			},
		},
		wrapInForm: {
			description:
				"Indicates whether to wrap Frontend Engine fields within the `<form>` element, by default, fields will be rendered within the `<form>` element<br>When false, the fields will be rendered within the `<div>` element instead<br>This is for instances where Frontend Engine needs to be rendered within another <form> element",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: {
					summary: "true",
				},
			},
			control: {
				type: "boolean",
			},
		},
	},
};
export default meta;

const DATA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				name: {
					label: "What is your name",
					uiType: "text-field",
					validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
				},
				email: {
					label: "Email address",
					uiType: "email-field",
					validation: [{ required: true }],
				},
				sex: {
					uiType: "select",
					label: "Sex",
					options: [
						{ label: "Male", value: "male" },
						{ label: "Female", value: "female" },
					],
				},
				radio: {
					uiType: "radio",
					label: "Radio Button",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
					],
				},
				unit: {
					label: "Unit Number",
					uiType: "unit-number-field",
				},
				multi: {
					uiType: "multi-select",
					label: "Fruits",
					options: [
						{ value: "1", label: "1" },
						{ value: "2", label: "2" },
						{ value: "3", label: "3" },
					],
				},
				description: {
					label: "Feedback",
					uiType: "textarea",
					rows: 3,
					resizable: true,
					validation: [{ required: true }],
					chipTexts: ["Best", "Good", "Bad", "Horrible"],
				},
				...SUBMIT_BUTTON_SCHEMA,
				...RESET_BUTTON_SCHEMA,
			},
		},
	},
	overrides: {},
};

const Template: StoryFn<IFrontendEngineProps> = (args) => <FrontendEngine {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {
		validationMode: "onTouched",
		revalidationMode: "onChange",
		...DATA,
	},
};

export const ValidateOnChange = Template.bind({});
ValidateOnChange.args = {
	data: {
		validationMode: "onChange",
		revalidationMode: "onChange",
		...DATA,
	},
};

export const ValidateOnBlur = Template.bind({});
ValidateOnBlur.args = {
	data: {
		validationMode: "onBlur",
		revalidationMode: "onChange",
		...DATA,
	},
};

export const ValidateOnSubmit = Template.bind({});
ValidateOnSubmit.args = {
	data: {
		validationMode: "onSubmit",
		revalidationMode: "onChange",
		...DATA,
	},
};

export const ValidateOnAll = Template.bind({});
ValidateOnAll.args = {
	data: {
		validationMode: "all",
		revalidationMode: "onChange",
		...DATA,
	},
};

export const OnChange: StoryFn<IFrontendEngineProps> = (args: IFrontendEngineProps) => <FrontendEngine {...args} />;
OnChange.args = {
	data: {
		sections: {
			section: {
				uiType: "section",
				children: {
					explanation: {
						uiType: "div",
						className: "margin-bottom-1",
						children: "onChange is fired on mount and every time the schema of value changes",
					},
					...DATA.sections.section.children,
				},
			},
		},
	},
	onChange: (values, isValid) => action("change")(values, isValid),
};

export const OnValueChange: StoryFn<IFrontendEngineProps> = (args: IFrontendEngineProps) => (
	<FrontendEngine {...args} />
);
OnValueChange.args = {
	data: {
		sections: {
			section: {
				uiType: "section",
				children: {
					explanation: {
						uiType: "div",
						className: "margin-bottom-1",
						children: "onValueChange is only fired every time a value changes",
					},
					...DATA.sections.section.children,
				},
			},
		},
	},
};

export const ExternalSubmit: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		ref.current.submit();
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} wrapInForm={false} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				My custom submit button
			</Button.Default>
		</>
	);
};
ExternalSubmit.storyName = "External Submit Button";
ExternalSubmit.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const MultiColumn: StoryFn<IFrontendEngineProps> = () => {
	return (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						layoutType: "grid",
						children: {
							name: {
								label: "What is your name",
								uiType: "text-field",
								columns: { desktop: 6, mobile: 4 },
								validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
							},
							email: {
								label: "Email address",
								uiType: "email-field",
								columns: { desktop: 6, mobile: 4 },
								validation: [{ required: true }],
							},
							sex: {
								uiType: "select",
								label: "Sex",
								columns: { mobile: 4 },
								options: [
									{ label: "Male", value: "male" },
									{ label: "Female", value: "female" },
								],
							},
						},
					},
				},
			}}
		/>
	);
};
MultiColumn.storyName = "Multi-Column";
MultiColumn.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const OverrideSchema: StoryFn<IFrontendEngineProps> = () => {
	const [schema, setSchema] = useState<IFrontendEngineData>({
		sections: {
			section1: {
				uiType: "section",
				children: {
					title1: {
						uiType: "h5",
						children: "Section to be removed when overridden",
					},
					field: {
						label: "Section field",
						uiType: "text-field",
					},
				},
			},
			section2: {
				uiType: "section",
				children: {
					title2: {
						uiType: "h5",
						children: "Section",
					},
					name: {
						label: "What is your name",
						uiType: "text-field",
						validation: [{ required: true }, { max: 5, errorMessage: "Maximum length of 5" }],
					},
					email: {
						label: "Email address",
						uiType: "email-field",
						validation: [{ required: true }],
						showIf: [{ radio: [{ filled: true }] }],
					},
					radio: {
						uiType: "radio",
						label: "Radio Button",
						options: [
							{ label: "Apple", value: "Apple" },
							{ label: "Berry", value: "Berry" },
							{ label: "Cherry", value: "Cherry" },
						],
					},
				},
			},
			section3: {
				uiType: "section",
				children: {
					...SUBMIT_BUTTON_SCHEMA,
				},
			},
		},
		defaultValues: {
			name: "BOB",
			email: "BOB@hotmail.com",
		},
	});

	const handleClick = () => {
		setSchema((state) => {
			return {
				...state,
				overrides: {
					section1: null,
					name: {
						label: "Overridden label",
						disabled: true,
					},
					email: {
						disabled: true,
					},
					radio: {
						options: [undefined, undefined, undefined, { label: "Durian", value: "Durian" }],
					},
				},
			};
		});
	};
	return (
		<>
			<FrontendEngine data={schema} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Override fields
			</Button.Default>
		</>
	);
};

export const GetValues: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		action("getValues")(ref.current.getValues());
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Get form state
			</Button.Default>
		</>
	);
};
GetValues.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const SetValue: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		ref.current.setValue("name", "Erik");
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Update name to Erik
			</Button.Default>
		</>
	);
};
SetValue.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const CheckIsValid: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		action("isValid")(ref.current.isValid());
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Check form validity
			</Button.Default>
		</>
	);
};
CheckIsValid.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const TriggerValidation: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = (fields?: string | string[] | undefined) => {
		ref.current.validate(fields);
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={() => handleClick("name")}>
				Validate name only
			</Button.Default>
			<br />
			<Button.Default styleType="secondary" onClick={() => handleClick(["name", "email"])}>
				Validate name and email address only
			</Button.Default>
			<br />
			<Button.Default styleType="secondary" onClick={() => handleClick()}>
				Validate entire form
			</Button.Default>
		</>
	);
};
TriggerValidation.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const CheckUserIntervention: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		action("isDirty")(ref.current.isDirty);
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Check if user has edited the form
			</Button.Default>
		</>
	);
};
CheckUserIntervention.parameters = {
	controls: { hideNoControlsWarning: true },
};

interface IYupCustomValidationRule {
	mustBeHello?: boolean | undefined;
}
export const AddCustomValidation: StoryFn = () => {
	const ref = useRef<IFrontendEngineRef>();

	useEffect(() => {
		ref.current?.addCustomValidation("string", "mustBeHello", (value) => value === "hello");
	}, [ref]);

	return (
		<FrontendEngine<IYupCustomValidationRule>
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							text: {
								label: "Only accepts hello",
								uiType: "text-field",
								validation: [
									{ required: true },
									{ mustBeHello: true, errorMessage: "Please key in hello" },
								],
							},
							...SUBMIT_BUTTON_SCHEMA,
						},
					},
				},
				defaultValues: {
					text: "Hi",
				},
			}}
			ref={ref}
		/>
	);
};
AddCustomValidation.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const SetCustomErrors: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		try {
			throw {
				name: "API error",
			};
		} catch (error) {
			ref.current.setErrors(error);
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
								name: {
									label: "What is your name",
									uiType: "text-field",
								},
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
					validationMode: "onSubmit",
				}}
				ref={ref}
			/>
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Trigger API error upon click
			</Button.Default>
		</>
	);
};
SetCustomErrors.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const SetWarnings: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		ref.current.setWarnings({ name: "Warning" });
	};

	return (
		<>
			<FrontendEngine
				data={{
					sections: {
						section: {
							uiType: "section",
							children: {
								name: {
									label: "What is your name",
									uiType: "text-field",
								},
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
					validationMode: "onSubmit",
				}}
				ref={ref}
			/>
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Trigger warning upon click
			</Button.Default>
		</>
	);
};
SetWarnings.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const Reset: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		ref.current.reset();
	};

	return (
		<>
			<FrontendEngine data={{ ...DATA, defaultValues: { name: "Bob" } }} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Reset form
			</Button.Default>
		</>
	);
};

Reset.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const OnSubmitError: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();

	return (
		<FrontendEngine
			data={{ ...onSubmitErrorData }}
			ref={ref}
			onSubmitError={(e) => {
				action("onSubmitError")(e);
				const invalidElement = document.querySelector("*[aria-invalid=true]");
				if (invalidElement && invalidElement.id) {
					document.querySelector(`label[for=${invalidElement.id}]`).scrollIntoView();
				} else {
					document.querySelector(`*[aria-invalid=true]`).scrollIntoView();
				}
			}}
		/>
	);
};

const onSubmitErrorData: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				explanation: {
					uiType: "div",
					className: "margin-bottom-1",
					children:
						"This example attempts to navigate the error input's label into view when submitting a form with errors. An alterate implementation could use the :has() pseudo-class, but that may be unsupported in some browsers (Firefox).",
				},
				...DATA.sections.section.children,
			},
		},
	},
	validationMode: "onSubmit",
};

OnSubmitError.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const StripUnknown: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const json: IFrontendEngineData = {
		stripUnknown: true,
		sections: {
			section: {
				uiType: "section",
				children: {
					explanation: {
						uiType: "div",
						className: "margin-bottom-1",
						children: `When stripUnknown=true, fields that are not declared in the schema will not be included in
							the submitted values or in getValues()`,
					},
					...DATA.sections.section.children,
				},
			},
		},
	};
	const handleAddUnknownValues = () => {
		ref.current.setValue("unknownField", "hello world");
		action("add unknownField value to form")({ id: "unknownField", value: "hello world" });
	};
	const handleGetFormState = () => {
		action("getValues")(ref.current.getValues());
	};

	return (
		<>
			<FrontendEngine data={json} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleAddUnknownValues}>
				Add unknown field value to form
			</Button.Default>
			<br />
			<Button.Default styleType="secondary" onClick={handleGetFormState}>
				Get values
			</Button.Default>
		</>
	);
};
StripUnknown.parameters = {
	controls: { hideNoControlsWarning: true },
};

interface MyCustomSchema extends TCustomComponentSchema<"my-custom-component"> {
	displayTitle: string;
	description: string;
}

const MyCustomComponent: TCustomComponent<MyCustomSchema> = (props: TCustomComponentProps<MyCustomSchema>) => {
	const {
		error,
		id,
		onChange,
		schema: { description, displayTitle, validation },
		...otherProps
	} = props;

	const {
		validation: { setValidation },
		event: { dispatchFieldEvent },
	} = useFrontendEngineComponent();

	useEffect(() => {
		setValidation(
			id,
			Yup.string().test("custom-rule", "My custom component error", (value) => {
				return value === "hello" || value === "world";
			}),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
		dispatchFieldEvent("custom-change", id, e);
	};

	return (
		<>
			<Text.BodySmall style={{ marginBottom: "2rem" }}>{description}</Text.BodySmall>
			<Form.Input
				label={displayTitle}
				id={id}
				errorMessage={error?.message}
				onChange={handleChange}
				{...otherProps}
			/>
		</>
	);
};

export const CustomComponent: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();

	useEffect(() => {
		const currentFormRef = ref.current;
		currentFormRef.addFieldEventListener("custom-change", "myCustomComponent", handleEvent);

		return () => {
			currentFormRef.removeFieldEventListener("custom-change", "myCustomComponent", handleEvent);
		};
	}, []);

	const handleEvent = (e) => {
		action("custom-change")(e);
	};

	const json: IFrontendEngineData<undefined, MyCustomSchema> = {
		sections: {
			section: {
				uiType: "section",
				children: {
					myCustomComponent: {
						referenceKey: "my-custom-component",
						displayTitle: "Custom component",
						description: `This component is defined outside Frontend Engine and fed into the instance at runtime. It accepts either "hello" or "world" and fires "custom-change" event on change.`,
						validation: [{ required: true }],
					},
					...SUBMIT_BUTTON_SCHEMA,
					...RESET_BUTTON_SCHEMA,
				},
			},
		},
	};
	return (
		<FrontendEngine<undefined, MyCustomSchema>
			components={{ "my-custom-component": MyCustomComponent }}
			data={json}
			ref={ref}
		/>
	);
};
CustomComponent.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const RenderWithoutForm: StoryFn<IFrontendEngineProps> = () => {
	return (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							intro: {
								uiType: "div",
								className: "margin-bottom-1",
								children: "These fields are not rendered within the <form> element.",
							},
							...DATA.sections.section.children,
						},
					},
				},
			}}
			wrapInForm={false}
		/>
	);
};
RenderWithoutForm.parameters = {
	controls: { hideNoControlsWarning: true },
};
