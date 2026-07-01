import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { ISelectSchema } from "../../../../components/fields";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getField,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite } from "../../../common/tests";
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "select";

const renderComponent = createRenderComponent<ISelectSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: "Select",
		uiType: UI_TYPE,
		options: [
			{ label: "A", value: "Apple" },
			{ label: "B", value: "Berry" },
		],
	},
	submitFn: SUBMIT_FN,
});

const ComponentWithSetSchemaButton = (props: { onClick: (data: IFrontendEngineData) => IFrontendEngineData }) => {
	const { onClick } = props;
	const [schema, setSchema] = useState<IFrontendEngineData>(renderComponent.schema);
	return (
		<>
			<FrontendEngine data={schema} onSubmit={SUBMIT_FN} />
			<Button.Default onClick={() => setSchema(onClick)}>Update options</Button.Default>
		</>
	);
};

const getSelectToggle = (): HTMLElement => {
	return screen.getByTestId("selector");
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		setupJestCanvasMock();
	});

	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getSelectToggle()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultLabel = "A";
		const defaultValue = "Apple";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByTestId("selector")).toHaveTextContent(defaultLabel);
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		expect(getSelectToggle()).toHaveAttribute("aria-disabled", "true");
	});

	it("should be able to support custom placeholder", () => {
		const placeholder = "select item";
		renderComponent({ placeholder });

		expect(screen.getByText(placeholder)).toBeInTheDocument();
	});

	it("should support default values matching initial overrides", async () => {
		const value = "Overridden";
		renderComponent(
			{ options: [] },
			{
				defaultValues: { [COMPONENT_ID]: value },
				overrides: { [COMPONENT_ID]: { options: [{ label: value, value: value }] } },
			}
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
	});

	describe("update options through schema", () => {
		it.each`
			scenario                                                                 | selected | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field value if option is not removed on schema update"} | ${"A"}   | ${"Apple"}                | ${"Apple"}
			${"should clear field value if option is removed on schema update"}      | ${"B"}   | ${"Berry"}                | ${""}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string>) => {
				render(
					<ComponentWithSetSchemaButton
						onClick={(data) =>
							merge(cloneDeep(data), {
								sections: {
									section: {
										children: {
											[COMPONENT_ID]: {
												options: [
													{ label: "A", value: "Apple" },
													{ label: "B", value: "b" },
													{ label: "C", value: "Cherry" },
												],
											},
										},
									},
								},
							})
						}
					/>
				);

				await waitFor(() => fireEvent.click(getSelectToggle()));
				fireEvent.click(screen.getByRole("option", { name: selected }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
				);
			}
		);
	});

	describe("update options through overrides", () => {
		it.each`
			scenario                                                              | selected | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field value if option is not removed on overriding"} | ${"A"}   | ${"Apple"}                | ${"Apple"}
			${"should clear field value if option is removed on overriding"}      | ${"B"}   | ${"Berry"}                | ${""}
		`(
			"$scenario",
			async ({ selected, expectedValueBeforeUpdate, expectedValueAfterUpdate }: Record<string, string>) => {
				render(
					<ComponentWithSetSchemaButton
						onClick={(data) => ({
							...data,
							overrides: {
								[COMPONENT_ID]: {
									options: [
										{ label: "A", value: "Apple" },
										{ label: "B", value: "b" },
										{ label: "C", value: "Cherry" },
									],
								},
							},
						})}
					/>
				);

				await waitFor(() => fireEvent.click(getSelectToggle()));
				fireEvent.click(screen.getByRole("option", { name: selected }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueBeforeUpdate })
				);

				fireEvent.click(screen.getByRole("button", { name: "Update options" }));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(SUBMIT_FN).toHaveBeenCalledWith(
					expect.objectContaining({ [COMPONENT_ID]: expectedValueAfterUpdate })
				);
			}
		);
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.click(getSelectToggle());
			fireEvent.click(screen.getByRole("option", { name: "A" }));
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByTestId("selector")).toHaveTextContent("Select");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "Apple";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.click(getField("combobox"));
			fireEvent.click(screen.getByRole("option", { name: "B" }));
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByTestId("selector")).toHaveTextContent("A");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema: renderComponent.schema,
		componentId: COMPONENT_ID,
		defaultValue: ["Apple"],
		modifyField: () => {
			fireEvent.click(getSelectToggle());
			fireEvent.click(screen.getByRole("option", { name: "A" }));
		},
	});

	labelTestSuite(renderComponent);
	warningTestSuite<ISelectSchema>({
		label: "Select",
		uiType: UI_TYPE,
		options: [
			{ label: "A", value: "Apple" },
			{ label: "B", value: "Berry" },
		],
	});
});
