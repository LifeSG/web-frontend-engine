import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { IChipsSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "chips";
const TEXT_AREA_LABEL = "D";

const renderComponent = (overrideField?: TOverrideField<IChipsSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[COMPONENT_ID]: {
				label: "Chips",
				uiType: UI_TYPE,
				options: [
					{ label: "A", value: "Apple" },
					{ label: "B", value: "Berry" },
				],
				...overrideField,
			},
			...getSubmitButtonProps(),
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getChipA = (pressed = false): HTMLElement => {
	return getField("button", pressed ? { name: "A", pressed: true } : "A");
};

const getChipB = (): HTMLElement => {
	return getField("button", "B");
};

const getTextareaChip = (): HTMLElement => {
	return getField("button", TEXT_AREA_LABEL);
};

const getTextarea = (isQuery = false): HTMLElement => {
	return getField("textbox", TEXT_AREA_LABEL, isQuery);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getChipA()).toBeInTheDocument();
		expect(getChipB()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = ["Apple"];
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getChipA(true)).toBeInTheDocument();
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getChipA()).toBeDisabled();
		expect(getChipB()).toBeDisabled();
	});

	it("should be able to toggle the chips", async () => {
		renderComponent();
		const apple = getChipA();
		const berry = getChipB();

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple", "Berry"] }));

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: [] }));
	});

	it("should be able to support single selection", async () => {
		renderComponent({ validation: [{ max: 1 }] });
		const apple = getChipA();
		const berry = getChipB();

		await waitFor(() => fireEvent.click(apple));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Apple"] }));

		await waitFor(() => fireEvent.click(berry));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: ["Berry"] }));
	});

	it("should be able to render textarea upon selection", async () => {
		renderComponent({ textarea: { label: TEXT_AREA_LABEL } });

		expect(getTextarea(true)).not.toBeInTheDocument();

		await waitFor(() => fireEvent.click(getTextareaChip()));
		expect(getTextarea()).toBeInTheDocument();
	});

	describe("textarea", () => {
		it("should be able to support validation schema", async () => {
			renderComponent({
				textarea: { label: TEXT_AREA_LABEL, validation: [{ required: true, errorMessage: ERROR_MESSAGE }] },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should be able to resize vertically", async () => {
			renderComponent({
				textarea: { label: TEXT_AREA_LABEL, resizable: true },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));

			expect(getTextarea()).toHaveStyle({ resize: "vertical" });
		});

		it("should be able to support custom rows", async () => {
			renderComponent({
				textarea: { label: TEXT_AREA_LABEL, rows: 1 },
			});

			await waitFor(() => fireEvent.click(getTextareaChip()));

			expect(getTextarea()).toHaveAttribute("rows", "1");
		});
	});

	describe("update options schema", () => {
		const CustomComponent = () => {
			const [options, setOptions] = useState([
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry" },
				{ label: "C", value: "Cherry" },
				{ label: "D", value: "Durian" },
			]);
			return (
				<>
					<FrontendEngine
						data={{
							id: FRONTEND_ENGINE_ID,
							fields: {
								[COMPONENT_ID]: { label: "Chips", uiType: UI_TYPE, options },
								...getSubmitButtonProps(),
							},
						}}
						onSubmit={SUBMIT_FN}
					/>
					<Button.Default
						onClick={() =>
							setOptions([
								{ label: "A", value: "Apple" },
								{ label: "B", value: "Berry" },
								{ label: "C", value: "C" },
								{ label: "E", value: "Eggplant" },
							])
						}
					>
						Update options
					</Button.Default>
				</>
			);
		};
		it.each`
			scenario                                                                             | selected      | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field values if option is not removed on schema update"}            | ${["A", "B"]} | ${["Apple", "Berry"]}     | ${["Apple", "Berry"]}
			${"should clear field values if option is removed on schema update"}                 | ${["C", "D"]} | ${["Cherry", "Durian"]}   | ${[]}
			${"should retain the field values of options that are not removed on schema update"} | ${["A", "D"]} | ${["Apple", "Durian"]}    | ${["Apple"]}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(<CustomComponent />);

				selected.forEach((name) => fireEvent.click(screen.getByRole("button", { name })));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate }));
			}
		);
	});
});
