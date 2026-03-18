import { Button } from "@lifesg/react-design-system/button";
import { ArgTypes, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { ReactElement, useEffect, useRef } from "react";
import { ILocationCoord, ILocationFieldSchema, ILocationFieldValues } from "../../../components/fields";
import { IMapPin } from "../../../components/fields/location-field/location-modal/location-picker/types";
import { IFrontendEngineRef, TFrontendEngineFieldSchema } from "../../../components/frontend-engine";
import { RecursivePartial } from "../../../utils";
import { CommonFieldStoryProps, FrontendEngine, OVERRIDES_ARG_TYPE, SUBMIT_BUTTON_SCHEMA } from "../../common";

const reverseGeocode = "https://api.dev.lifesg.io/onemap/revgeocode";
const convertLatLngToXY = "https://api.dev.lifesg.io/onemap/4326to3414";
const search = "https://api.dev.lifesg.io/onemap/search";

const recaptchaSiteKey = "6LfCjocsAAAAALM6wuZN3bqarbgbdaLuJIgFSrXT";
const defaultMapApi = {
	reverseGeocode,
	convertLatLngToXY,
	search,
	headers: {
		"x-client-app": "LifeSG",
	},
};

const DefaultLocationStoryTemplate = <T, U = string>(id: string, hideSubmit = false) =>
	(({ defaultValues, ...args }) => (
		<FrontendEngine
			recaptchaSiteKey={recaptchaSiteKey}
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args as unknown as TFrontendEngineFieldSchema,
							...(!hideSubmit ? SUBMIT_BUTTON_SCHEMA : {}),
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
	)) as StoryFn<(args: T & { defaultValues?: U | undefined }) => ReactElement>;

const OverrideLocationStoryTemplate = <T,>(id: string, showSubmitButton = true) =>
	(({ overrides, ...args }) => (
		<FrontendEngine
			recaptchaSiteKey={recaptchaSiteKey}
			data={{
				sections: {
					section: {
						uiType: "section",
						children: {
							[id]: args as unknown as TFrontendEngineFieldSchema,
							...(showSubmitButton && { ...SUBMIT_BUTTON_SCHEMA }),
						},
					},
				},
				...(!!overrides && {
					overrides: {
						[id]: overrides,
					},
				}),
			}}
		/>
	)) as StoryFn<(args: T & { overrides?: RecursivePartial<T> | undefined }) => ReactElement>;

const FrontendEngineWithWarning = ({ id, fieldSchema }: { id: string; fieldSchema: TFrontendEngineFieldSchema }) => {
	const formRef = useRef<IFrontendEngineRef>(null);

	return (
		<>
			<FrontendEngine
				recaptchaSiteKey={recaptchaSiteKey}
				ref={formRef}
				data={{
					sections: {
						section: {
							uiType: "section",
							children: {
								[id]: fieldSchema,
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
				}}
			/>
			<Button.Default
				onClick={() =>
					formRef.current?.setWarnings({
						[id]: "This is a warning message, it is set via `setWarnings()` from Frontend Engine.",
					})
				}
				style={{ marginTop: "2rem" }}
			>
				Show warning
			</Button.Default>
		</>
	);
};

const WarningLocationStoryTemplate = <T,>(id: string) =>
	((args) => (
		<FrontendEngineWithWarning id={id} fieldSchema={args as unknown as TFrontendEngineFieldSchema} />
	)) as StoryFn<(args: T & { overrides?: RecursivePartial<T> | undefined }) => ReactElement>;

const meta: Meta = {
	title: "Field/LocationField",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Location Input</Title>
					<p>
						A field component to select, search and view location on a map. Error handling is included.
						Error cases covered are one map error, get current location timout, get current location error
						and no network error.
					</p>
					<ArgTypes of={Default} />
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
				defaultValue: { summary: "false" },
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
					summary: `{mobile?: number, nonMobile?: number, min?: number, max?: number, duration?: number}`,
				},
			},
			control: { type: "object" },
		},
		locationSelectionMode: {
			description:
				"Specifies how the user can select location. If set to 'pins-only', user can only selection location based on pins. If set to 'default' or undefined, user can select on by clicking on map as well as pins",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: "default" },
			},
			options: ["default", "pins-only", undefined],
			control: {
				type: "select",
			},
		},
		disableSearch: {
			description: "Specifies if the search input field is disabled or set to read only. Enabled if undefined",
			table: {
				type: {
					summary: "string",
				},
				defaultValue: { summary: undefined },
			},
			options: ["disabled", "readonly", undefined],
			control: {
				type: "select",
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
			options: [undefined, "explicit", "show"],
			control: {
				type: "select",
			},
		},
		bufferRadius: {
			description:
				"Used in reverse geocoding, this value (0-500m) sets the radius around a point to include all buildings within that area and find their addresses",
			table: {
				type: {
					summary: "number",
				},
				defaultValue: { summary: "500" },
			},
			control: {
				type: "number",
			},
		},
		pinsOnlyIndicateCurrentLocation: {
			description:
				"Specifies if the user's current location is to be shown on the map when in pins-only mode. The current location marker is unselectable.",
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
};
export default meta;

export const Default = DefaultLocationStoryTemplate<ILocationFieldSchema>("location-field-default").bind({});
Default.args = {
	uiType: "location-field",
	label: "Default",
	mapApi: defaultMapApi,
};

export const LabelCustomisation = DefaultLocationStoryTemplate<ILocationFieldSchema>(
	"location-label-customisation"
).bind({});
LabelCustomisation.args = {
	uiType: "location-field",
	label: {
		mainLabel: "Location <strong>with bold text</strong>",
		subLabel: "Some helpful <strong>instructions</strong>",
		hint: { content: "A helpful tip<br>Another helpful tip on next line" },
	},
};

export const InitialAddress = DefaultLocationStoryTemplate<ILocationFieldSchema, ILocationFieldValues>(
	"location-field-initial-address"
).bind({});
InitialAddress.args = {
	uiType: "location-field",
	label: "Default",
	defaultValues: {
		address: "Fusionopolis View",
	},
	mapApi: defaultMapApi,
};
InitialAddress.parameters = {
	docs: {
		description: {
			story: "If only address is present, address will be searched. The first search result will be selected.",
		},
	},
};

export const InitialLatLng = DefaultLocationStoryTemplate<ILocationFieldSchema, ILocationFieldValues>(
	"location-field-initial-address"
).bind({});
InitialLatLng.args = {
	uiType: "location-field",
	label: "Default",
	defaultValues: {
		lat: 1.2418352709904754,
		lng: 103.61478567123413,
	},
	mapApi: defaultMapApi,
};
InitialLatLng.parameters = {
	docs: {
		description: {
			story: "If only latlng is present, the location will be reverse geo located if reverseGeoCodeEndpoint is provided. The first search result will be selected.",
		},
	},
};

export const FullInitialAddress = DefaultLocationStoryTemplate<ILocationFieldSchema, ILocationFieldValues>(
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
	mapApi: defaultMapApi,
};
FullInitialAddress.parameters = {
	docs: {
		description: {
			story: "If both are present, no prepopulation logic will be done. The first search result will be selected.",
		},
	},
};

export const MustHavePostalCode = DefaultLocationStoryTemplate<ILocationFieldSchema>("location-field-postal-code").bind(
	{}
);
MustHavePostalCode.args = {
	uiType: "location-field",
	label: "MustHavePostalCode",
	mustHavePostalCode: true,
	mapApi: defaultMapApi,
};

export const Warning = WarningLocationStoryTemplate<ILocationFieldSchema>("location-field-with-warning").bind({});
Warning.args = {
	uiType: "location-field",
	label: "Default",
	mapApi: defaultMapApi,
};

export const Disabled = DefaultLocationStoryTemplate<ILocationFieldSchema>("location-field-disabled").bind({});
Disabled.args = {
	uiType: "location-field",
	label: "Disabled ",
	mapApi: defaultMapApi,
	disabled: true,
};

export const BannerCustomisation = DefaultLocationStoryTemplate<ILocationFieldSchema>(
	"location-field-banner-customisation"
).bind({});
BannerCustomisation.args = {
	uiType: "location-field",
	label: "Banner Customisation",
	mapApi: defaultMapApi,
	mapBannerText: "This is some banner text",
};

export const WithCustomStyles = DefaultLocationStoryTemplate<ILocationFieldSchema>("location-field-custom-styles").bind(
	{}
);
WithCustomStyles.args = {
	uiType: "location-field",
	label: "WithCustomStyles",
	locationModalStyles: "padding-top: 50px; margin-right: 10px;",
	mapApi: defaultMapApi,
};

export const Overrides = OverrideLocationStoryTemplate<ILocationFieldSchema>("location-field-overrides").bind({});
Overrides.args = {
	uiType: "location-field",
	label: "Location",
	overrides: {
		label: "Overridden",
	},
	mapApi: defaultMapApi,
};
Overrides.argTypes = OVERRIDES_ARG_TYPE;

export const LocationListTitle = DefaultLocationStoryTemplate<ILocationFieldSchema>(
	"location-field-location-list-title"
).bind({});
LocationListTitle.args = {
	uiType: "location-field",
	label: "Location List Title",
	locationListTitle: "Nearest car parks",
	mapApi: defaultMapApi,
};

export const WithCustomMapPanZoom = DefaultLocationStoryTemplate<ILocationFieldSchema>(
	"location-field-custom-map-pan-zoom"
).bind({});
WithCustomMapPanZoom.args = {
	uiType: "location-field",
	label: "WithCustomMapPanZoom",
	mapApi: defaultMapApi,
	mapPanZoom: { mobile: 17, nonMobile: 17, min: 12, max: 14, duration: 1 },
};

export const DisableSearch = DefaultLocationStoryTemplate<ILocationFieldSchema>("disable-text-search").bind({});
DisableSearch.args = {
	uiType: "location-field",
	label: "DisableSearch",
	mapApi: defaultMapApi,
	disableSearch: "disabled",
};

export const locationSelectionMode = DefaultLocationStoryTemplate<ILocationFieldSchema>(
	"location-field-selection-mode"
).bind({});
locationSelectionMode.args = {
	uiType: "location-field",
	label: "Location Selection Mode",
	mapApi: defaultMapApi,
	locationSelectionMode: "pins-only",
};

/* eslint-disable react-hooks/rules-of-hooks */
const IndicateCurrentLocationTemplate = () =>
	((args) => {
		const id = "location-enable-map-click";
		const formRef = useRef<IFrontendEngineRef>();

		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener("location-field", "get-selectable-pins", id, getPins);

			return () => {
				currentFormRef.removeFieldEventListener("location-field", "get-selectable-pins", id, getPins);
			};
		}, []);

		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const getPins = (e: CustomEvent<ILocationCoord>) => {
			const res = [
				{
					carParkName: "BLK 120 TO 124 PAYA LEBAR WAY",
					carParkNumber: "M32",
					carParkType: "SURFACE CAR PARK",
					parkingSystem: "ELECTRONIC PARKING",
					latitude: 1.3223122045708784,
					longitude: 103.88279263612282,
					xCoord: 33506.0078,
					yCoord: 33840.2109,
					distanceFromReference: 109.9831233911331,
				},
			];
			setTimeout(() => {
				formRef.current.dispatchFieldEvent("location-field", "set-selectable-pins", id, {
					pins: res.map(
						(r) =>
							({
								lat: r.latitude,
								lng: r.longitude,
								resultListItemText: r.carParkName,
								address: `${r.carParkName} (${r.carParkNumber})`,
							} as IMapPin)
					),
				});
			}, 2000);
		};

		return (
			<>
				<FrontendEngine
					recaptchaSiteKey={recaptchaSiteKey}
					ref={formRef}
					data={{
						sections: {
							section: {
								uiType: "section",
								children: {
									[id]: {
										...args,
									},
									...SUBMIT_BUTTON_SCHEMA,
								},
							},
						},
					}}
				/>
			</>
		);
	}) as StoryFn<ILocationFieldSchema>;

export const pinsOnlyIndicateCurrentLocation = IndicateCurrentLocationTemplate().bind({});
pinsOnlyIndicateCurrentLocation.args = {
	uiType: "location-field",
	label: "Indicate Current Location",
	mapApi: defaultMapApi,
	locationSelectionMode: "pins-only",
	pinsOnlyIndicateCurrentLocation: true,
	interactiveMapPinIconUrl:
		"https://dev.eservices.lifesg.io/report-neighbourhood-issue/img/icons/car-location-pin.svg",
};
