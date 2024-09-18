import { fireEvent, render, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IErrorFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/types";
import {
	FRONTEND_ENGINE_ID,
	TOverrideSchema,
	getField,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const PARENT_ID = "input";
const UI_TYPE = "error-field";
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[PARENT_ID]: {
					uiType: "text-field",
					label: "Text",
				},
				[COMPONENT_ID]: {
					uiType: UI_TYPE,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: Partial<IErrorFieldSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), overrideSchema);
	merge(json, {
		sections: {
			section: {
				children: {
					[COMPONENT_ID]: overrideField,
				},
			},
		},
	});
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should cause form to be invalid if shown", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should not affect form validity if not shown", async () => {
		renderComponent(
			{ showIf: [{ [PARENT_ID]: [{ equals: "error" }] }] },
			{ defaultValues: { [PARENT_ID]: "not-error" } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalled();
	});

	it("should update form validity when conditionally rendered", async () => {
		renderComponent({ showIf: [{ [PARENT_ID]: [{ equals: "error" }] }] });

		fireEvent.change(getField("textbox", "Text"), { target: { value: "not-error" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledTimes(1);

		fireEvent.change(getField("textbox", "Text"), { target: { value: "error" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledTimes(1);
	});
});
