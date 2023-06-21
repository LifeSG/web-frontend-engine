import { Text } from "@lifesg/react-design-system";
import { action } from "@storybook/addon-actions";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, Story } from "@storybook/react/types-6-0";
import { useEffect, useRef, useState } from "react";
import {
	ILocationInputSchema,
	TIsOnAppDetail,
	TLocationInputEvents,
	TSetCurrentLocationDetail,
	TShowErrorModalDetail,
} from "../../../components/fields";
import { ERROR_SVG, TIMEOUT_SVG } from "../../../components/fields/location-field/location-modal/location-modal.data";
import { ErrorImage } from "../../../components/fields/location-field/location-modal/location-modal.styles";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { Prompt } from "../../../components/shared";
import { Description as PDescription } from "../../../components/shared/prompt/prompt.styles";
import { TestHelper } from "../../../utils";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
import Default from "./location-field.stories";

export default {
	title: "Field/LocationField/Events",
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
		const id = "location-field-get-current-location";
		const formRef = useRef<IFrontendEngineRef>();

		const handleGetCurrentLocation = (e: TLocationInputEvents["get-current-location"]) => {
			// Here is where you would call the device geolocation api
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
	uiType: "location-field",
	label: "Geolocation",
};

export const GeolocationWithErrors = GeolocationTemplate({
	errors: {
		code: 3,
	} as GeolocationPositionError,
});
GeolocationWithErrors.args = {
	uiType: "location-field",
	label: "Geolocation with errors",
};

/* eslint-disable react-hooks/rules-of-hooks */
const AppQueryTemplate = (detail: TIsOnAppDetail) =>
	((args) => {
		const id = "location-field-get-is-app";
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
	uiType: "location-field",
	label: "App query with disableErrorPromptOnApp",
	disableErrorPromptOnApp: true,
};

interface HotlineContent {
	name: string;
	number: string;
}

const hotlineContent: HotlineContent = {
	name: "Agency",
	number: "999",
};

/* eslint-disable react-hooks/rules-of-hooks */
const ShowErrorModalsTemplate = () =>
	((args) => {
		const id = "location-field-get-current-location";
		const formRef = useRef<IFrontendEngineRef>();
		const [showGetLocationError, setShowGetLocationError] = useState(false);
		const [showOneMapError, setShowOneMapError] = useState(false);
		const [showGetLocationTimeoutError, setShowGetLocationTimeoutError] = useState(false);
		const [showPostalCodeError, setShowPostalCodeError] = useState(false);

		const renderUnableToSubmitReport = (): JSX.Element => {
			return (
				<>
					<br />
					<br />
					Do note that you&rsquo;ll not be able to submit your report without entering the location.
				</>
			);
		};

		const renderHotlineDetails = ({ name, number }: HotlineContent): JSX.Element => {
			return (
				<>
					<br />
					<br />
					Alternatively, you can call the&nbsp;
					<Text.Body inline weight="semibold">
						{name} hotline&nbsp;
					</Text.Body>
					at&nbsp;
					<Text.Hyperlink.Default weight="semibold" href={`tel:${number}`}>
						{number}
					</Text.Hyperlink.Default>
					.
				</>
			);
		};

		const renderNetworkErrorPrompt = () => {
			// event delegation for errors
			if (showOneMapError) {
				return (
					<Prompt
						id={TestHelper.generateId(id, "onemap-error")}
						data-testid={TestHelper.generateId(id, "onemap-error")}
						title="Map not available"
						size="large"
						show={true}
						image={<ErrorImage src={ERROR_SVG} />}
						description={
							<PDescription weight="regular">
								Sorry, there was a problem with the map. You&rsquo;ll not be able to enter the location
								right now. Please try again later.
								{hotlineContent ? renderHotlineDetails(hotlineContent) : renderUnableToSubmitReport()}
							</PDescription>
						}
						buttons={[
							{
								id: "ok",
								title: "OK",
								onClick: () => {
									setShowOneMapError(false);
									formRef.current.dispatchFieldEvent<TShowErrorModalDetail>("close-error-modal", id, {
										payload: {
											modalName: "OneMapError",
										},
									});
								},
							},
						]}
					/>
				);
			}

			if (showGetLocationError) {
				return (
					<Prompt
						id={TestHelper.generateId(id, "get-location-error")}
						data-testid={TestHelper.generateId(id, "get-location-error")}
						title="Enable location settings"
						size="large"
						show={true}
						description={"my custom location permission error message"}
						buttons={[
							{
								id: "ok",
								title: "OK",
								onClick: () => {
									setShowGetLocationError(false);
									formRef.current.dispatchFieldEvent<TShowErrorModalDetail>("close-error-modal", id, {
										payload: {
											modalName: "GetLocationError",
										},
									});
								},
							},
						]}
					/>
				);
			}

			if (showGetLocationTimeoutError) {
				return (
					<Prompt
						id={TestHelper.generateId(id, "get-location-timeout-error")}
						data-testid={TestHelper.generateId(id, "get-location-timeout-error")}
						title="Something went wrong"
						size="large"
						show={true}
						image={<ErrorImage src={TIMEOUT_SVG} />}
						description={
							<PDescription weight="regular">
								It&rsquo;s taking longer than expected to retrieve your location. Please exit the map
								and try again.
								<br />
								<br />
								Alternatively, you can call the&nbsp;
								<Text.Body inline weight="semibold">
									{hotlineContent.name} hotline&nbsp;
								</Text.Body>
								at&nbsp;
								<Text.Hyperlink.Default weight="semibold" href={`tel:${hotlineContent.number}`}>
									{hotlineContent.number}
								</Text.Hyperlink.Default>
								.
							</PDescription>
						}
						buttons={[
							{
								id: "ok",
								title: "OK",
								onClick: () => {
									setShowGetLocationTimeoutError(false);
									formRef.current.dispatchFieldEvent<TShowErrorModalDetail>("close-error-modal", id, {
										payload: {
											modalName: "GetLocationTimeoutError",
										},
									});
								},
							},
						]}
					/>
				);
			}

			if (showPostalCodeError) {
				return (
					<Prompt
						id={`${id}-postal-code-error`}
						title="Oops"
						size="large"
						show={true}
						description="The location you have selected does not contain a postal code. Please pick the building where the high-rise littering took place."
						buttons={[
							{
								id: "ok",
								title: "OK",
								onClick: () => setShowPostalCodeError(false),
							},
						]}
					/>
				);
			}
		};

		const handleShowErrorModal = (e: TLocationInputEvents["show-error-modal"]) => {
			// match error
			// show modal
			const modalName = e.detail?.payload?.modalName;

			if (!modalName) {
				// deal with unsupported errors
				return;
			}

			switch (modalName) {
				case "GetLocationError":
					e.preventDefault();
					setShowGetLocationError(true);
					break;
				case "OneMapError":
					e.preventDefault();
					setShowOneMapError(true);
					break;
				case "GetLocationTimeoutError":
					e.preventDefault();
					setShowGetLocationTimeoutError(true);
					break;
				case "PostalCodeError":
					e.preventDefault();
					setShowPostalCodeError(true);
					break;
				default:
					//do nothing
					break;
			}

			return action("show-error-modal")(e);
		};

		useEffect(() => {
			const currentFormRef = formRef.current;

			currentFormRef.addFieldEventListener("show-error-modal", id, handleShowErrorModal);

			return () => {
				currentFormRef.removeFieldEventListener("show-error-modal", id, handleShowErrorModal);
			};
		}, []);

		return (
			<div>
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
				{renderNetworkErrorPrompt()}
			</div>
		);
	}) as Story<ILocationInputSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const CustomErrorModals = ShowErrorModalsTemplate().bind(this);
CustomErrorModals.args = {
	uiType: "location-field",
	label: "CustomErrorModal",
	mustHavePostalCode: true,
	reverseGeoCodeEndpoint: "willBreak",
};
