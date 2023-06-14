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

export const InitialAddress = DefaultStoryTemplate<ILocationInputSchema, ILocationInputValues>(
	"location-input-initial-address"
).bind({});
InitialAddress.args = {
	uiType: "location-input",
	label: "Default",
	defaultValues: {
		address: "Fusionopolis View",
	},
};
InitialAddress.parameters = {
	docs: {
		description: {
			story: "If only address is present, address will be searched. The first search result will be selected.",
		},
	},
};

export const InitialLatLng = DefaultStoryTemplate<ILocationInputSchema, ILocationInputValues>(
	"location-input-initial-address"
).bind({});
InitialLatLng.args = {
	uiType: "location-input",
	label: "Default",
	defaultValues: {
		lat: 1.29994179707526,
		lng: 103.789404349716,
	},
	reverseGeoCodeEndpoint: "https://www.dev.lifesg.io/oneservice/api/v1/one-map/reverse-geo-code",
};
InitialLatLng.parameters = {
	docs: {
		description: {
			story: "If only latlng is present, the location will be reverse geo located if reverseGeoCodeEndpoint is provided. The first search result will be selected.",
		},
	},
};

export const FullInitialAddress = DefaultStoryTemplate<ILocationInputSchema, ILocationInputValues>(
	"location-input-initial-address"
).bind({});
FullInitialAddress.args = {
	uiType: "location-input",
	label: "Default",
	defaultValues: {
		address: "1 FUSIONOPOLIS VIEW ECLIPSE SINGAPORE 138577",
		blockNo: "1",
		building: "ECLIPSE",
		lat: 1.299941797074924,
		lng: 103.78940434971592,
		postalCode: "138577",
		roadName: "FUSIONOPOLIS VIEW",
		x: 23112.7395757,
		y: 31366.5202628,
	},
	reverseGeoCodeEndpoint: "https://www.dev.lifesg.io/oneservice/api/v1/one-map/reverse-geo-code",
};
FullInitialAddress.parameters = {
	docs: {
		description: {
			story: "If both are present, no prepopulation logic will be done. The first search result will be selected.",
		},
	},
};
