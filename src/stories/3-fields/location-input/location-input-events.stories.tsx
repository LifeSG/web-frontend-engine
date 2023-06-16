import { action } from "@storybook/addon-actions";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { useEffect, useRef } from "react";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
import Default from "./location-input.stories";
import {
	ILocationInputSchema,
	TIsOnAppDetail,
	TLocationInputEvents,
	TSetCurrentLocationDetail,
} from "../../../components/fields";

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
const GeolocationTemplate = (detail: TSetCurrentLocationDetail) =>
	((args) => {
		const id = "location-input-get-current-location";
		const formRef = useRef<IFrontendEngineRef>();

		const handleGetCurrentLocation = (e: TLocationInputEvents["get-current-location"]) => {
			//Add mock call device geolocation here if needed
			e.preventDefault();
			formRef.current.dispatchFieldEvent<TSetCurrentLocationDetail>("set-current-location", id, detail);
			return action("get-current-location")(e);
		};

		useEffect(() => {
			const currentFormRef = formRef.current;

			currentFormRef.addFieldEventListener("get-current-location", id, handleGetCurrentLocation);

			return () => {
				currentFormRef.removeFieldEventListener("get-current-location", id, handleGetCurrentLocation);
			};
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

export const Geolocation = GeolocationTemplate({
	payload: {
		lat: 1.29994179707526,
		lng: 103.789404349716,
	},
}).bind({});
Geolocation.args = {
	uiType: "location-input",
	label: "Geolocation",
};

export const GeolocationWithErrors = GeolocationTemplate({
	errors: {
		code: 3,
	} as GeolocationPositionError,
});
GeolocationWithErrors.args = {
	uiType: "location-input",
	label: "Geolocation with errors",
};

/* eslint-disable react-hooks/rules-of-hooks */
const AppQueryTemplate = (detail: TIsOnAppDetail) =>
	((args) => {
		const id = "location-input-get-is-app";
		const formRef = useRef<IFrontendEngineRef>();

		const handleAppQuery = (e: TLocationInputEvents["get-is-app"]) => {
			formRef.current.dispatchFieldEvent("set-is-app", id, detail);
			return action("get-is-app")(e);
		};

		useEffect(() => {
			const currentFormRef = formRef.current;

			currentFormRef.addFieldEventListener("get-is-app", id, handleAppQuery);

			return () => {
				currentFormRef.removeFieldEventListener("get-is-app", id, handleAppQuery);
			};
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

export const AppQuery = AppQueryTemplate({
	payload: {
		isOnApp: true,
	},
});
AppQuery.args = {
	uiType: "location-input",
	label: "App query with disableErrorPromptOnApp",
	disableErrorPromptOnApp: true,
};
