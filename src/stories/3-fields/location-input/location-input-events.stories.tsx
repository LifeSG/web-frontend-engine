import { action } from "@storybook/addon-actions";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { useEffect, useRef } from "react";
import { ILocationInputSchema, TLocationInputEvent, TSetCurrentLocationDetail } from "../../../components/fields";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
import Default from "./location-input.stories";

export default {
	title: "Field/LocationInput/Events",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Events for Image Upload field</Title>
					<Description>
						Custom events unique to the image upload field, it allows adding of event listeners to it.
					</Description>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
			source: {
				code: null,
			},
		},
	},
	argTypes: Default.argTypes,
} as Meta;

/* eslint-disable react-hooks/rules-of-hooks */
const GeolocationTemplate = (eventName: string, detail?: TSetCurrentLocationDetail) =>
	((args) => {
		const id = `location-input-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleMount = (e: TLocationInputEvent) => action(eventName)(e);

		const handleGetCurrentLocation = (e: TLocationInputEvent) => {
			//Add mock call device geolocation here if needed

			formRef.current.dispatchFieldEvent<TSetCurrentLocationDetail>(
				"set-current-location",
				id,
				detail || {
					payload: {
						lat: 1.29994179707526,
						lng: 103.789404349716,
					},
					// TODO: improve the naming scheme
					errors: {
						GeolocationPositionError2: {
							code: "3",
						},
					},
				}
			);
			return action(eventName)(e);
		};

		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventName, id, handleGetCurrentLocation);
			currentFormRef.addFieldEventListener("mount", id, handleMount);
			return () => {
				currentFormRef.removeFieldEventListener(eventName, id, handleGetCurrentLocation);
				currentFormRef.removeFieldEventListener("mount", id, handleMount);
			};
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);

		return (
			<FrontendEngine
				ref={formRef}
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
				}}
			/>
		);
	}) as Story<ILocationInputSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const Geolocation = GeolocationTemplate("get-current-location").bind({});
Geolocation.args = {
	uiType: "location-input",
	label: "Geolocation",
};
