import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ILocationInputSchema, ILocationInputValues } from "../../../components/fields/location-input-group/types";
import { CommonFieldStoryProps, DefaultStoryTemplate } from "../../common";

export default {
	title: "Field/LocationInput",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Location Input</Title>
					<Description>
						A field component to select, search and view location on a map. Error handling is included.
						Error cases covered are one map error, get current location timout, get current location error
						and no network error.
					</Description>
					<Heading>Props</Heading>
					<ArgsTable story={PRIMARY_STORY} />
					<Stories includePrimary={true} title="Examples" />
				</>
			),
		},
	},
	argTypes: {
		...CommonFieldStoryProps("location-input"),
	},
} as Meta;

export const Default = DefaultStoryTemplate<ILocationInputSchema>("location-input-default").bind({});
Default.args = {
	uiType: "location-input",
	label: "Default",
};
