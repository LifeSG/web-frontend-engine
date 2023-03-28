import { Button } from "@lifesg/react-design-system/button";
import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { useEffect, useRef } from "react";
import {
	FrontendEngine,
	IFrontendEngineData,
	IFrontendEngineProps,
	IFrontendEngineRef,
} from "../../components/frontend-engine";
import { SUBMIT_BUTTON_SCHEMA } from "../common";

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
};

export default {
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
				" Validation strategy when inputs with errors get re-validated after a user submits the form (onSubmit event).",
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
			description: "Validation strategy before a user submits the form (onSubmit event)",
			table: {
				type: {
					summary: "TValidationMode",
					detail: "onBlur | onChange | onSubmit",
				},
				defaultValue: {
					summary: "onSubmit",
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
	},
} as Meta;

const Template: Story<IFrontendEngineProps> = (args) => <FrontendEngine {...args} />;

export const Default = Template.bind({});
Default.args = {
	data: {
		validationMode: "onSubmit",
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

export const OnChange: Story<IFrontendEngineProps> = () => (
	<FrontendEngine data={DATA} onChange={(values, isValid) => console.log({ values, isValid })} />
);
OnChange.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const ExternalSubmit: Story<IFrontendEngineProps> = () => {
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

export const GetValues: Story<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		console.log(ref.current.getValues());
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Get form state (check console)
			</Button.Default>
		</>
	);
};
GetValues.parameters = {
	controls: { hideNoControlsWarning: true },
};

export const SetValue: Story<IFrontendEngineProps> = () => {
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

export const CheckIsValid: Story<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();
	const handleClick = () => {
		console.log(ref.current.isValid());
	};

	return (
		<>
			<FrontendEngine data={DATA} ref={ref} />
			<br />
			<Button.Default styleType="secondary" onClick={handleClick}>
				Get form state (check console)
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
export const AddCustomValidation: Story = () => {
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

export const SetCustomErrors: Story<IFrontendEngineProps> = () => {
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
