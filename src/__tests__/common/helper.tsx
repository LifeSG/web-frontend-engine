import { ByRoleOptions, screen } from "@testing-library/react";
import {
	FrontendEngine,
	IFrontendEngineData,
	IFrontendEngineProps,
	IFrontendEngineRef,
	TFrontendEngineFieldSchema,
	TFrontendEngineValues,
} from "../../components/frontend-engine";
import { ERROR_MESSAGE, RESET_BUTTON_ID, RESET_BUTTON_LABEL, SUBMIT_BUTTON_ID, SUBMIT_BUTTON_LABEL } from "./data";
import { useRef } from "react";

type TAriaRoles = "textbox" | "generic" | "button" | "spinbutton" | "radio" | "list";

export const getSubmitButton = (): HTMLElement => {
	return screen.getByRole("button", { name: SUBMIT_BUTTON_LABEL });
};

export const getResetButton = (): HTMLElement => {
	return screen.getByRole("button", { name: RESET_BUTTON_LABEL });
};

export const getSubmitButtonProps = (): Record<string, TFrontendEngineFieldSchema> => {
	return {
		[SUBMIT_BUTTON_ID]: {
			label: SUBMIT_BUTTON_LABEL,
			uiType: "submit",
		},
	};
};

export const getResetButtonProps = (): Record<string, TFrontendEngineFieldSchema> => {
	return {
		[RESET_BUTTON_ID]: {
			label: RESET_BUTTON_LABEL,
			uiType: "reset",
		},
	};
};

export const getField = (
	role: TAriaRoles,
	nameOrConfig?: string | RegExp | ByRoleOptions,
	isQuery = false
): HTMLElement => {
	let options: ByRoleOptions = {};

	if (typeof nameOrConfig === "string" || nameOrConfig instanceof RegExp) {
		options = { name: nameOrConfig };
	} else {
		options = { ...nameOrConfig };
	}

	// NOTE: Query does not throw an error if not exist
	if (isQuery) {
		return screen.queryByRole(role, options);
	}
	return screen.getByRole(role, options);
};

export const getErrorMessage = (isQuery = false): HTMLElement => {
	if (isQuery) {
		return screen.queryByText(ERROR_MESSAGE);
	}
	return screen.getByText(ERROR_MESSAGE);
};

export const flushPromise = (delay = 0) => new Promise((resolve) => setTimeout(resolve, delay));

export const FrontendEngineWithCustomButton = (props: {
	onClick: (ref: React.MutableRefObject<IFrontendEngineRef>) => void;
	onSubmit?: (values: TFrontendEngineValues) => unknown | undefined;
	data: IFrontendEngineData;
	overrideProps?: Partial<Exclude<IFrontendEngineProps, "onSubmit">>;
}) => {
	const { data, onClick, onSubmit, overrideProps } = props;
	const ref = useRef<IFrontendEngineRef>();

	return (
		<>
			<FrontendEngine {...overrideProps} data={data} ref={ref} onSubmit={onSubmit} />
			<button type="button" onClick={() => onClick(ref)}>
				Custom Button
			</button>
		</>
	);
};
