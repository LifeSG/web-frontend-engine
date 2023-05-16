import { ArgsTable, Description, Heading, PRIMARY_STORY, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { ILocationInputSchema, ILocationInputValues } from "../../../components/fields/location-input-group/types";
import { CommonFieldStoryProps, FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

const defaultSchema: ILocationInputSchema = {
	uiType: "location-input",
	label: "Default",
	reverseGeoCodeEndpoint: "",
};

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
		reverseGeoCodeEndpoint: {
			description: "API endpoint to do reverse geocode.",
			table: {
				type: {
					summary: "string",
				},
			},
			control: {
				type: "text",
			},
		},
		defaultValues: {
			description:
				"Value to prepopulate react hook form. If only address is present, address will be searched. If only latlng is present, the location will be reverse geo located if reverseGeoCodeEndpoint is provided. If both are present, no prepopulation logic will be done. The first search result will be selected.",
			table: {
				type: {
					summary: `{ [id] : {
						address?: string;
						blockNo?: string;
						building?: string;
						postalCode?: string;
						roadName?: string;
						lat?: number;
						lng?: number;
						x?: number;
						y?: number;
					}}`,
				},
			},
			control: {
				type: "object",
			},
		},
		mustHavePostalCode: {
			description:
				"Allow only addresses with postal codes, will show error prompt if an address without postal code is picked.",
			table: {
				type: {
					summary: "boolean",
				},
			},
			control: {
				type: "boolean",
			},
		},
	},
} as Meta;

const Template = (id: string) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args,
							...SUBMIT_BUTTON_SCHEMA,
						},
					},
				},
				...(!!defaultValues && {
					defaultValues: {
						[id]: defaultValues,
					},
				}),
			}}
		/>
	)) as Story<ILocationInputSchema & { defaultValues?: ILocationInputValues | undefined }>;

export const Default = Template("location-input-default").bind({});
Default.args = {
	uiType: "location-input",
	label: "Default",
};

export const InitialAddress = Template("location-input-initial-address").bind({});
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

export const InitialLatLng = Template("location-input-initial-latlng").bind({});
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

export const FullInitialAddress = Template("location-input-initial-address").bind({});
FullInitialAddress.args = {
	uiType: "location-input",
	label: "Default",
	defaultValues: {
		lat: 1.2998377990473173,
		lng: 103.7891384953316,
		blockNo: "1",
		building: "ECLIPSE",
		postalCode: "138577",
		roadName: "FUSIONOPOLIS VIEW",
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

export const MustHavePostalCode = Template("location-input-initial-address").bind({});
MustHavePostalCode.args = {
	...defaultSchema,
	mustHavePostalCode: true,
};
