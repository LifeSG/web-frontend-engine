import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { useRef, useState } from "react";
import { FrontendEngine } from "../../../components";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/frontend-engine";
import { SUBMIT_BUTTON_SCHEMA } from "../../common";
import { Toast } from "@lifesg/react-design-system/toast";
import { Modal } from "@lifesg/react-design-system";

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
					label: "Excessive Radio Button",
					options: [
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
						{ label: "Apple", value: "Apple" },
						{ label: "Berry", value: "Berry" },
						{ label: "Cherry", value: "Cherry" },
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
	validationMode: "onSubmit",
};

export default {
	title: "Form/Frontend Engine/On Submit Error",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Sample usage for onSubmitError</Title>
					<Description>
						onSubmitError prop takes a handler which is invoked when the form encounters validation errors
						on submission. The callback invocation is delayed to the next tick to ensure the DOM has been
						updated to allow handling of validation errors via `aria-invalid` attributes. Here is an of
						example of how onSubmitError can be used.
					</Description>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
} as Meta;

export const ScrollToError: Story<IFrontendEngineProps> = () => {
	const ref = useRef<IFrontendEngineRef>();

	return (
		<>
			<FrontendEngine
				data={{ ...DATA }}
				ref={ref}
				onSubmitError={(e) => {
					console.log("Validation Errors: ", e);
					const invalidElement = document.querySelector("div:has(*[aria-invalid=true]) > label");
					invalidElement?.scrollIntoView();
				}}
			/>
		</>
	);
};

ScrollToError.parameters = {
	controls: { hideNoControlsWarning: true },
};
