import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

const meta: Meta = {
	title: "Field/ErrorField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>ErrorField</Title>
					<p>
						A form element that forces the form to be invalid when present. Useful for validating known
						combinations of input.
					</p>
					<ArgTypes of={Default} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("error-field"),
		columns: { table: { disable: true } },
		label: { table: { disable: true } },
		validation: { table: { disable: true } },
		children: {
			type: { name: "object", value: {} },
			description: "The content to display, usually an error message",
			table: {
				type: {
					summary: "Record<string, TErrorFieldChildren>",
				},
			},
		},
	},
};
export default meta;

export const Default = () => (
	<FrontendEngine
		data={{
			sections: {
				section: {
					uiType: "section",
					children: {
						fruit: {
							uiType: "radio",
							label: "Fruit",
							options: [
								{ label: "Apple", value: "Apple" },
								{ label: "Bell Pepper", value: "Bell Pepper" },
							],
						},
						color: {
							uiType: "radio",
							label: "Color",
							options: [
								{ label: "Red", value: "Red" },
								{ label: "Green", value: "Green" },
								{ label: "Purple", value: "Purple" },
							],
						},
						error: {
							uiType: "error-field",
							showIf: [
								{
									fruit: [{ equals: "Apple" }],
									color: [{ equals: "Purple" }],
								},
							],
							children: {
								errorAlert: {
									uiType: "alert",
									type: "error",
									children: "Apples cannot be purple",
								},
							},
						},
						...SUBMIT_BUTTON_SCHEMA,
					},
				},
			},
		}}
	/>
);
