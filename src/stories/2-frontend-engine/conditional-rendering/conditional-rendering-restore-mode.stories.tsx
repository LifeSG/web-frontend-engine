import { Button } from "@lifesg/react-design-system/button";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useRef } from "react";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

const DATA: IFrontendEngineData = {
	sections: {
		section: {
			uiType: "section",
			children: {
				field1: {
					label: "Field 1",
					uiType: "text-field",
					placeholder: 'Type "show"',
					validation: [{ required: true }],
				},
				field2: {
					label: "Field 2 (depends on Field 1)",
					uiType: "date-field",
					showIf: [{ field1: [{ equals: "show" }] }],
					validation: [{ required: true }],
					withButton: false,
				},
				field3: {
					label: "Field 3 (depends on Field 1)",
					uiType: "chips",
					showIf: [{ field1: [{ equals: "show" }] }],
					validation: [{ required: true }],
					options: [
						{ value: "1", label: "Opt 1" },
						{ value: "2", label: "Opt 2" },
						{ value: "3", label: "Opt 3" },
					],
					textarea: {
						label: "Others",
					},
				},
				...SUBMIT_BUTTON_SCHEMA,
			},
		},
	},
	defaultValues: {
		field1: "show",
		field2: "2023-01-01",
		"field3-textarea": "hello",
	},
};

const meta: Meta = {
	title: "Form/Conditional Rendering/Restoring Values",
	component: null,
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Restore values</Title>
					<Description>
						When a field&apos;s visibility is restored, the value that is populated can be configured via
						the `restoreMode` flag.
					</Description>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
};
export default meta;

const Template: StoryFn<IFrontendEngineProps> = (args) => {
	const ref = useRef<IFrontendEngineRef>();
	const handleReset = () => {
		ref.current.reset();
	};

	return (
		<>
			<style dangerouslySetInnerHTML={{ __html: ".hidden {display: none};" }} />
			<FrontendEngine ref={ref} {...args} />
			<br />
			<Button.Default styleType="secondary" onClick={handleReset}>
				Reset form
			</Button.Default>
		</>
	);
};

export const None = Template.bind({});
None.args = {
	data: {
		...DATA,
		restoreMode: "none",
	},
};

export const RestoreDefaultValue = Template.bind({});
RestoreDefaultValue.args = {
	data: {
		...DATA,
		restoreMode: "default-value",
	},
};

export const RestoreUserInput = Template.bind({});
RestoreUserInput.args = {
	data: {
		...DATA,
		restoreMode: "user-input",
	},
};
