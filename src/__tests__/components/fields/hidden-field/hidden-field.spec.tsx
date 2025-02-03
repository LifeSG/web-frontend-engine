import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { THiddenFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideSchema,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "hidden-field";
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					uiType: UI_TYPE,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: Partial<THiddenFieldSchema> | undefined, overrideSchema?: TOverrideSchema) => {
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

const getHiddenField = (): HTMLElement => {
	return screen.getByTestId(COMPONENT_ID);
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getHiddenField()).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should support default value", async () => {
		const defaultValue = "hello";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should support number validation if valueType=number", async () => {
		const defaultValue = 1;
		renderComponent(
			{ valueType: "number", validation: [{ moreThan: 2, errorMessage: ERROR_MESSAGE }] },
			{ defaultValues: { [COMPONENT_ID]: defaultValue } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should support boolean validation if valueType=boolean", async () => {
		const defaultValue = true;
		renderComponent(
			{ valueType: "boolean", validation: [{ equals: false, errorMessage: ERROR_MESSAGE }] },
			{ defaultValues: { [COMPONENT_ID]: defaultValue } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should support setting of value from the schema", async () => {
		renderComponent({ valueType: "number", value: 0 });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: 0 }));
	});

	it("should not let default value override the schema value", async () => {
		const defaultValue = true;
		renderComponent({ valueType: "boolean", value: false }, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: false }));
	});

	it("should not let setValue override the schema value", async () => {
		const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), {
			sections: {
				section: {
					children: {
						[COMPONENT_ID]: { valueType: "string", value: "hello" },
					},
				},
			},
		});
		render(
			<FrontendEngineWithCustomButton
				data={json}
				onSubmit={SUBMIT_FN}
				onClick={(ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue(COMPONENT_ID, "bye");
				}}
			/>
		);

		fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "hello" }));
	});

	describe("dirty state", () => {
		let formIsDirty: boolean;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};

		beforeEach(() => {
			formIsDirty = undefined;
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "hello" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "hello" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.change(getHiddenField(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should mount with schema value without setting field state as dirty", () => {
			const json: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), {
				sections: {
					section: {
						children: {
							[COMPONENT_ID]: { valueType: "string", value: "hello" },
						},
					},
				},
			});
			render(<FrontendEngineWithCustomButton data={json} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	describe("reset", () => {
		it("should revert to schema value on reset", async () => {
			renderComponent({ valueType: "string", value: "hello" }, { defaultValues: { [COMPONENT_ID]: "bye" } });

			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "hello" }));
		});
	});
});
