import { Form } from "@lifesg/react-design-system/form";
import { useCallback, useEffect, useState } from "react";
import { EPostMessageEvent } from "../../../../components/custom";
import { useIframeMessage } from "../../../../utils/hooks";

export const ChildValidation = () => {
	// =========================================================================
	// CONST, STATE, REF
	// =========================================================================
	const [stateValue, setStateValue] = useState("");
	const [errorMessage, setErrorMessage] = useState("");
	const host = `${window.location.protocol}//${window.location.host}`;

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		window.parent.postMessage({ type: EPostMessageEvent.TRIGGER_SYNC }, host);
	}, []);

	// =========================================================================
	// POSTMESSAGE HANDLERS
	// =========================================================================
	useIframeMessage(
		EPostMessageEvent.SYNC,
		useCallback((e) => {
			setStateValue(e.data.payload.value ?? "");
		}, [])
	);

	useIframeMessage(
		EPostMessageEvent.VALIDATE,
		useCallback((e) => {
			const fieldValue = e.data.payload.value;
			let newErrorMessage = null;
			if (!fieldValue) {
				newErrorMessage = "This field is required.";
			} else if (fieldValue !== "hello world") {
				newErrorMessage = "Only accepts `hello world`.";
			}
			setErrorMessage(newErrorMessage);
			window.parent.postMessage({ type: EPostMessageEvent.VALIDATION_RESULT, payload: !newErrorMessage }, host);
		}, [])
	);

	// =========================================================================
	// EVENT HANDLERS
	// =========================================================================
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setStateValue(e.target.value);
		window.parent.postMessage({ type: EPostMessageEvent.SET_VALUE, payload: e.target.value }, host);
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<Form.Input
			label="Required field and only accepts `hello world`"
			value={stateValue}
			onChange={handleChange}
			errorMessage={errorMessage}
		/>
	);
};
