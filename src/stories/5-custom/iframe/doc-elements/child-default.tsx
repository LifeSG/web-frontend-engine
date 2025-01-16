import { Form } from "@lifesg/react-design-system/form";
import { useCallback, useEffect, useState } from "react";
import { EPostMessageEvent } from "../../../../components/custom";
import { useIframeMessage } from "../../../../utils/hooks";

export const ChildDefault = () => {
	// =========================================================================
	// CONST, STATE, REF
	// =========================================================================
	const [stateValue, setStateValue] = useState("");
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
	return <Form.Input label="This is served within an iframe" value={stateValue} onChange={handleChange} />;
};
