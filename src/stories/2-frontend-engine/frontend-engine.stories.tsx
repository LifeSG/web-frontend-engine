import { Button } from "@lifesg/react-design-system/button";
import { action } from "@storybook/addon-actions";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../common";

const meta: Meta = {
	title: "Form/Frontend Engine",
	component: FrontendEngine,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>FrontendEngine</Title>
					<Description>
						The main component to render a form, based on a JSON schema through the `data` prop.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
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
			description: "Fires every time a value changes in any fields",
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
	data: DATA,
	onChange: (values, isValid) => action("change")(values, isValid),
};

export const ExternalSubmit: StoryFn<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		ref.current.submit();
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
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
				Trigger API error upon submission
			</Button.Default>
		</>
	);
};
SetCustomErrors.parameters = {
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
					className: "margin--bottom",
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
