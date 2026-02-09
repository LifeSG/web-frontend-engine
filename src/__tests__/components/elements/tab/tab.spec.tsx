import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { ITabItemSchema, ITabSchema } from "../../../../components/elements";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import { FRONTEND_ENGINE_ID, TOverrideField, getField, getSubmitButton, getSubmitButtonProps } from "../../../common";
import { ICallbacks } from "../../../../context-providers";

const SUBMIT_FN = jest.fn();

const PARENT_ID = "tab";
const PARENT_FIELD_TYPE = "tab";
const FIELD_ONE_ID = "field1";
const FIELD_TWO_ID = "field2";
const FIELD_ONE_LABEL = "Field one";
const FIELD_TWO_LABEL = "Field two";
const FIELD_ONE_ERROR = "Error message one";
const FIELD_TWO_ERROR = "Error message two";

const renderComponent = (
	overrideField?: TOverrideField<ITabSchema>,
	children?: Record<string, ITabItemSchema>,
	defaultValues?: Record<string, unknown>,
	callbacks?: ICallbacks
) => {
	const defaultChildren: Record<string, ITabItemSchema> = {
		tabItem1: {
			uiType: "tab-item",
			title: "Tab Title 1",
			children: {
				text1: {
					uiType: "text-body",
					children: "Tab Body 1",
				},
			},
		},
		tabItem2: {
			uiType: "tab-item",
			title: "Tab Title 2",
			children: {
				text2: {
					uiType: "text-body",
					children: "Tab Body 2",
				},
			},
		},
	};
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[PARENT_ID]: {
						uiType: PARENT_FIELD_TYPE,
						children: children || defaultChildren,
						...overrideField,
					},
					...getSubmitButtonProps(),
				},
			},
		},
		defaultValues,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} callbacks={callbacks ?? {}} />);
};

const getFieldOne = (): HTMLElement => {
	return getField("textbox", FIELD_ONE_LABEL);
};

describe("Tab", () => {
	afterEach(() => {
		jest.resetAllMocks();
		jest.restoreAllMocks();
	});

	it("should be able to render tab items", () => {
		renderComponent();

		expect(screen.getByRole("tab", { name: "Tab Title 1" })).toBeInTheDocument();
		expect(screen.getByRole("tab", { name: "Tab Title 2" })).toBeInTheDocument();
	});

	it("should display the current active tab", () => {
		renderComponent({ currentActiveTabId: "tabItem2" });

		expect(screen.queryByText("Tab Body 1")).not.toBeInTheDocument();
		expect(screen.queryByText("Tab Body 2")).toBeInTheDocument();
	});

	it("should switch to the selected tab", () => {
		renderComponent({ currentActiveTabId: "tabItem2" });

		fireEvent.click(screen.getByRole("tab", { name: "Tab Title 1" }));

		expect(screen.queryByText("Tab Body 1")).toBeInTheDocument();
		expect(screen.queryByText("Tab Body 2")).not.toBeInTheDocument();
	});

	it("should remove validation schema for fields in inactive tabs", async () => {
		const uiType = "text-field";
		const fields: Record<string, ITabItemSchema> = {
			tabItem1: {
				uiType: "tab-item",
				title: "Tab title 1",
				children: {
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType,
						validation: [{ required: true, errorMessage: FIELD_ONE_ERROR }],
					},
				},
			},
			tabItem2: {
				uiType: "tab-item",
				title: "Tab title 2",
				children: {
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType,
						validation: [{ required: true, errorMessage: FIELD_TWO_ERROR }],
					},
				},
			},
		};
		renderComponent(undefined, fields);

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(screen.getByText(FIELD_ONE_ERROR)).toBeInTheDocument();
		expect(SUBMIT_FN).not.toHaveBeenCalled();

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hello" }));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.not.objectContaining({ [FIELD_TWO_ID]: expect.anything() }));
	});

	it("should not include values for fields in inactive tabs", async () => {
		const uiType = "text-field";
		const fields: Record<string, ITabItemSchema> = {
			tabItem1: {
				uiType: "tab-item",
				title: "Tab title 1",
				children: {
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType,
					},
				},
			},
			tabItem2: {
				uiType: "tab-item",
				title: "Tab title 2",
				children: {
					[FIELD_TWO_ID]: {
						label: FIELD_TWO_LABEL,
						uiType,
					},
				},
			},
		};
		renderComponent(undefined, fields, { [FIELD_ONE_ID]: "hello1", [FIELD_TWO_ID]: "hello2" });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hello1" }));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.not.objectContaining({ [FIELD_TWO_ID]: expect.anything() }));
	});

	describe("onTabChange callback", () => {
		it("should call onTabChange callback only once per tab switch", async () => {
			const onTabChange = jest.fn();
			renderComponent(undefined, undefined, undefined, { onTabChange });

			fireEvent.click(screen.getByRole("tab", { name: "Tab Title 2" }));

			await waitFor(() => {
				expect(onTabChange).toHaveBeenCalledTimes(1);
			});

			fireEvent.click(screen.getByRole("tab", { name: "Tab Title 1" }));

			await waitFor(() => {
				expect(onTabChange).toHaveBeenCalledTimes(2);
			});
		});

		it("should not call onTabChange callback if callback is not defined", async () => {
			renderComponent();

			fireEvent.click(screen.getByRole("tab", { name: "Tab Title 2" }));

			await waitFor(() => {
				expect(screen.queryByText("Tab Body 2")).toBeInTheDocument();
			});
		});
	});
});
