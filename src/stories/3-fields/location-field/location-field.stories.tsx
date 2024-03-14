import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta } from "@storybook/react";
import { ILocationFieldSchema, ILocationFieldValues } from "../../../components/fields";
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
		disabled: {
			description:
				"Specifies if the location field is interactive and editable. If true, the field will be rendered in a grey box with reduced visual contrast in text colour.",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		mapBannerText: {
			description: "Specifies the banner text to be displayed. If not specified, no banner will be displayed.",
			table: {
				type: {
					summary: "string",
				},
			},
			type: { name: "string", required: false },
			control: {
				type: "text",
			},
		},
		locationListTitle: {
			description: "Specifies the search results list title.",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "Select location" },
			},
			control: {
				type: "text",
			},
		},
		mapPanZoom: {
			description: "Specifies the map pan zoom value.",
			table: {
				type: {
					summary: `{mobile?: number, nonMobile?: number, min?: number, max?: number}`,
				},
			},
			control: { type: "object" },
		},
		disableTextSearch: {
			description: "Specifies if the search input field is disabled",
			table: {
				type: {
					summary: "boolean",
				},
				defaultValue: { summary: false },
			},
			options: [true, false],
			control: {
				type: "boolean",
			},
		},
		hasExplicitEdit: {
			description:
				"<div>Specifies the explicit edit behaviour: <ul><li>undefined: Edit button will not be shown even after select location</li><li>explicit: Show edit button after select location and disabled input field</li><li>show: Show edit button after select location.</li></ul></div>",
			table: {
				type: {
					summary: "undefined | explicit | show",
				},
			},
			control: {
				type: "text",
			},
		},
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

export const LabelCustomisation = DefaultStoryTemplate<ILocationFieldSchema>("location-label-customisation").bind({});
LabelCustomisation.args = {
	uiType: "location-field",
	label: {
		mainLabel: "Location <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
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

export const Disabled = DefaultStoryTemplate<ILocationFieldSchema>("location-field-disabled").bind({});
Disabled.args = {
	uiType: "location-field",
	label: "Disabled ",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
	disabled: true,
};

export const BannerCustomisation = DefaultStoryTemplate<ILocationFieldSchema>(
	"location-field-banner-customisation"
).bind({});
BannerCustomisation.args = {
	uiType: "location-field",
	label: "Banner Customisation",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
	mapBannerText: "This is some banner text",
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

export const LocationListTitle = DefaultStoryTemplate<ILocationFieldSchema>("location-field-location-list-title").bind(
	{}
);
LocationListTitle.args = {
	uiType: "location-field",
	label: "Location List Title",
	locationListTitle: "Nearest car parks",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
};

export const WithCustomMapPanZoom = DefaultStoryTemplate<ILocationFieldSchema>(
	"location-field-custom-map-pan-zoom"
).bind({});
WithCustomMapPanZoom.args = {
	uiType: "location-field",
	label: "WithCustomMapPanZoom",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
	mapPanZoom: { mobile: 17, nonMobile: 17, min: 12, max: 14 },
};

export const DisableTextSearch = DefaultStoryTemplate<ILocationFieldSchema>("disable-text-search").bind({});
DisableTextSearch.args = {
	uiType: "location-field",
	label: "DisableTextSearch",
	reverseGeoCodeEndpoint,
	convertLatLngToXYEndpoint,
	disableTextSearch: true,
};
