import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ILocationFieldSchema, ILocationFieldValues } from "../../../components/fields/location-field/types";
import { CommonFieldStoryProps, DefaultStoryTemplate, OVERRIDES_ARG_TYPE, OverrideStoryTemplate } from "../../common";

const reverseGeoCodeEndpoint = "https://www.dev.lifesg.io/oneservice/api/v1/one-map/reverse-geo-code";
const convertLatLngToXYEndpoint = "https://www.dev.lifesg.io/oneservice/api/v1/one-map/convert-latlng-to-xy";
const meta: Meta = {
	title: "Field/LocationField",
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
		...CommonFieldStoryProps("location-field"),
	},
};
export default meta;

export const Default = DefaultStoryTemplate<ILocationFieldSchema>("location-field-default").bind({});
Default.args = {
	uiType: "location-field",
	label: "Default",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};

export const InitialAddress = DefaultStoryTemplate<ILocationFieldSchema, ILocationFieldValues>(
	"location-field-initial-address"
).bind({});
InitialAddress.args = {
	uiType: "location-field",
	label: "Default",
	defaultValues: {
		address: "Fusionopolis View",
	},
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};
InitialAddress.parameters = {
	docs: {
		description: {
			story: "If only address is present, address will be searched. The first search result will be selected.",
		},
	},
};

export const InitialLatLng = DefaultStoryTemplate<ILocationFieldSchema, ILocationFieldValues>(
	"location-field-initial-address"
).bind({});
InitialLatLng.args = {
	uiType: "location-field",
	label: "Default",
	defaultValues: {
		lat: 1.2418352709904754,
		lng: 103.61478567123413,
	},
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};
InitialLatLng.parameters = {
	docs: {
		description: {
			story: "If only latlng is present, the location will be reverse geo located if reverseGeoCodeEndpoint is provided. The first search result will be selected.",
		},
	},
};

export const FullInitialAddress = DefaultStoryTemplate<ILocationFieldSchema, ILocationFieldValues>(
	"location-field-initial-address"
).bind({});
FullInitialAddress.args = {
	uiType: "location-field",
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
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};
FullInitialAddress.parameters = {
	docs: {
		description: {
			story: "If both are present, no prepopulation logic will be done. The first search result will be selected.",
		},
	},
};

export const MustHavePostalCode = DefaultStoryTemplate<ILocationFieldSchema>("location-field-postal-code").bind({});
MustHavePostalCode.args = {
	uiType: "location-field",
	label: "MustHavePostalCode",
	mustHavePostalCode: true,
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};

export const WithCustomStyles = DefaultStoryTemplate<ILocationFieldSchema>("location-field-custom-styles").bind({});
WithCustomStyles.args = {
	uiType: "location-field",
	label: "WithCustomStyles",
	locationModalStyles: "padding-top: 50px; margin-right: 10px;",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};

export const Overrides = OverrideStoryTemplate<ILocationFieldSchema>("location-field-overrides").bind({});
Overrides.args = {
	uiType: "location-field",
	label: "Location",
	overrides: {
		label: "Overridden",
	},
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;
