import { Text } from "@lifesg/react-design-system";
import { action } from "@storybook/addon-actions";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef, useState } from "react";
import {
	ILocationFieldSchema,
	TLocationFieldErrorDetail,
	TLocationFieldEvents,
	TSetCurrentLocationDetail,
} from "../../../components/fields";
import { ERROR_SVG, TIMEOUT_SVG } from "../../../components/fields/location-field/location-modal/location-modal.data";
import { ErrorImage } from "../../../components/fields/location-field/location-modal/location-modal.styles";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { Prompt } from "../../../components/shared";
import { Description as PDescription } from "../../../components/shared/prompt/prompt.styles";
import { TestHelper } from "../../../utils";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";
import Default from "./location-field.stories";

const meta: Meta = {
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
};
export default meta;

/* eslint-disable react-hooks/rules-of-hooks */
const Template = (eventName: string) =>
	((args) => {
		const id = `location-field-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleEvent = (e: unknown) => action(eventName)(e);

		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventName, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleEvent);
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
	}) as StoryFn<ILocationFieldSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

/* eslint-disable react-hooks/rules-of-hooks */
const GeolocationTemplate = (detail: TSetCurrentLocationDetail) =>
	((args) => {
		const id = "location-field-get-current-location";
		const formRef = useRef<IFrontendEngineRef>();

		const handleGetCurrentLocation = (e: TLocationFieldEvents["get-current-location"]) => {
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
	}) as StoryFn<ILocationFieldSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const ShowModal = Template("show-location-modal").bind({});
ShowModal.args = {
	uiType: "location-field",
	label: "Show Modal",
};

export const HideModal = Template("hide-location-modal").bind({});
HideModal.args = {
	uiType: "location-field",
	label: "Hide Modal",
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

interface HotlineContent {
	name: string;
	number: string;
}

const hotlineContent: HotlineContent = {
	name: "Agency",
	number: "999",
};

/* eslint-disable react-hooks/rules-of-hooks */
const ErrorEventsTemplate = () =>
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
									formRef.current.dispatchFieldEvent<TLocationFieldErrorDetail>("error-end", id, {
										payload: {
											errorType: "OneMapError",
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
									formRef.current.dispatchFieldEvent<TLocationFieldErrorDetail>("error-end", id, {
										payload: {
											errorType: "GetLocationError",
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
									formRef.current.dispatchFieldEvent<TLocationFieldErrorDetail>("error-end", id, {
										payload: {
											errorType: "GetLocationTimeoutError",
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

		const handleShowErrorModal = (e: TLocationFieldEvents["error"]) => {
			const errorType = e.detail?.payload?.errorType;

			if (!errorType) {
				// deal with unsupported errors
				return;
			}

			switch (errorType) {
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

			return action("error")(e);
		};

		useEffect(() => {
			const currentFormRef = formRef.current;

			currentFormRef.addFieldEventListener("error", id, handleShowErrorModal);

			return () => {
				currentFormRef.removeFieldEventListener("error", id, handleShowErrorModal);
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
	}) as StoryFn<ILocationFieldSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const CustomErrorHandling = ErrorEventsTemplate().bind(this);
CustomErrorHandling.args = {
	uiType: "location-field",
	label: "Custom error handling",
	mustHavePostalCode: true,
	reverseGeoCodeEndpoint: "willBreak",
};
