import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IRangeSelectSchema } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "range-select";

const renderComponent = (overrideField?: TOverrideField<IRangeSelectSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						label: "RangeSelect",
						uiType: UI_TYPE,
						options: {
							from: [
								{ label: "A", value: "Apple" },
								{ label: "B", value: "Berry" },
							],
							to: [
								{ label: "C", value: "Cherry" },
								{ label: "D", value: "Date" },
							],
						},
						listStyleWidth: "40rem",
						...overrideField,
					},
					...getSubmitButtonProps(),
					...getResetButtonProps(),
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

const getComponent = (): HTMLElement => {
	return getField("button", "Select Select");
};

const getOptionA = (): HTMLElement => {
	return screen.getAllByText("A")[0];
};

const getOptionC = (): HTMLElement => {
	return screen.getAllByText("C")[0];
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getComponent()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValues = { from: "Apple", to: "Cherry" };
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(screen.getByTestId(COMPONENT_ID)).toHaveTextContent("AC");
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent(
			{
				validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
			},
			{ defaultValues: { [COMPONENT_ID]: { from: "", to: "" } } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getComponent().parentElement).toHaveAttribute("disabled");
	});

	it("should be able to support custom placeholder", () => {
		const placeholders = { from: "ABC", to: "DEF" };
		renderComponent({ placeholders });

		expect(screen.getByText(placeholders.from)).toBeInTheDocument();
		expect(screen.getByText(placeholders.to)).toBeInTheDocument();
	});

	it("should be able to select both options", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getComponent()));

		await waitFor(() => fireEvent.click(getOptionA()));
		await waitFor(() => fireEvent.click(getOptionC()));
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: { from: "Apple", to: "Cherry" } }));
	});

	describe("update options schema", () => {
		const CustomComponent = () => {
			const [options, setOptions] = useState({
				from: [
					{ label: "A", value: "Apple" },
					{ label: "B", value: "Berry" },
				],
				to: [
					{ label: "C", value: "Cherry" },
					{ label: "D", value: "Date" },
				],
			});
			return (
				<>
					<FrontendEngine
						data={{
							id: FRONTEND_ENGINE_ID,
							sections: {
								section: {
									uiType: "section",
									children: {
										[COMPONENT_ID]: { label: "RangeSelect", uiType: UI_TYPE, options },
										...getSubmitButtonProps(),
									},
								},
							},
						}}
						onSubmit={SUBMIT_FN}
					/>
					<Button.Default
						onClick={() =>
							setOptions({
								from: [
									{ label: "A", value: "Apple" },
									{ label: "B", value: "Banana" },
								],
								to: [
									{ label: "C", value: "Cherry" },
									{ label: "E", value: "Eggplant" },
								],
							})
						}
					>
						Update options
					</Button.Default>
				</>
			);
		};

		it.each`
			scenario                                                                             | selected      | expectedValueBeforeUpdate          | expectedValueAfterUpdate
			${"should retain field values if option is not removed on schema update"}            | ${["A", "C"]} | ${{ from: "Apple", to: "Cherry" }} | ${{ from: "Apple", to: "Cherry" }}
			${"should clear field values if option is removed on schema update"}                 | ${["B", "D"]} | ${{ from: "Berry", to: "Date" }}   | ${{ from: "", to: "" }}
			${"should retain the field values of options that are not removed on schema update"} | ${["A", "D"]} | ${{ from: "Apple", to: "Date" }}   | ${{ from: "Apple", to: "" }}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string[]>) => {
				render(<CustomComponent />);
				await waitFor(() => fireEvent.click(getComponent()));

				selected.forEach((name) => fireEvent.click(screen.getAllByText(name)[0]));
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

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			await waitFor(() => fireEvent.click(getComponent()));
			await waitFor(() => fireEvent.click(getOptionA()));
			await waitFor(() => fireEvent.click(getOptionC()));
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(
				expect.objectContaining({ [COMPONENT_ID]: { from: undefined, to: undefined } })
			);
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = { from: "Apple", to: "Cherry" };
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			// Click on the range-select with default values
			await waitFor(() => fireEvent.click(getField("button", "A C")));
			await waitFor(() => fireEvent.click(screen.getAllByText("B")[0]));
			await waitFor(() => fireEvent.click(screen.getAllByText("D")[0]));
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
		});
	});
});
