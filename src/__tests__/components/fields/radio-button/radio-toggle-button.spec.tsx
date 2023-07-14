import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useState } from "react";
import { FrontendEngine } from "../../../../components";
import { IRadioButtonGroupSchema } from "../../../../components/fields";
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
const UI_TYPE = "radio";

const getRadioButtonA = (): HTMLElement => {
	return getField("radio", "A");
};

const getRadioButtonB = (): HTMLElement => {
	return getField("radio", "B");
};

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: "Radio",
					uiType: UI_TYPE,
					customOptions: {
						styleType: "toggle",
					},
					options: [
						{ label: "A", value: "Apple" },
						{ label: "B", value: "Berry" },
					],
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<IRadioButtonGroupSchema>, overrideSchema?: TOverrideSchema) => {
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

const ComponentWithSetSchemaButton = (props: { onClick: (data: IFrontendEngineData) => IFrontendEngineData }) => {
	const { onClick } = props;
	const [schema, setSchema] = useState<IFrontendEngineData>(JSON_SCHEMA);
	return (
		<>
			<FrontendEngine data={schema} onSubmit={SUBMIT_FN} />
			<Button.Default onClick={() => setSchema(onClick)}>Update options</Button.Default>
		</>
	);
};

describe("radio toggle button", () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getRadioButtonA()).toBeInTheDocument();
		expect(getRadioButtonB()).toBeInTheDocument();
	});

	it("should be able to support default values", async () => {
		const defaultValue = "Apple";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(getRadioButtonA()).toBeChecked();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should be able to support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be disabled if configured for options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple" },
				{ label: "B", value: "Berry", disabled: true },
			],
		});

		expect(getRadioButtonA()).toBeEnabled();
		expect(getRadioButtonB()).toBeDisabled();
	});

	it("should be disabled if configured for component", async () => {
		renderComponent({ disabled: true });

		expect(getRadioButtonA()).toBeDisabled();
		expect(getRadioButtonB()).toBeDisabled();
	});

	it("should be disabled if configured for both component/options", async () => {
		renderComponent({
			options: [
				{ label: "A", value: "Apple", disabled: false },
				{ label: "B", value: "Berry", disabled: false },
			],
			disabled: true,
		});

		expect(getRadioButtonA()).toBeDisabled();
		expect(getRadioButtonB()).toBeDisabled();
	});

	describe("update options schema", () => {
		it.each`
			scenario                                                                 | selected | expectedValueBeforeUpdate | expectedValueAfterUpdate
			${"should retain field value if option is not removed on schema update"} | ${"A"}   | ${"Apple"}                | ${"Apple"}
			${"should clear field value if option is removed on schema update"}      | ${"B"}   | ${"Berry"}                | ${""}
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

				fireEvent.click(screen.getByLabelText(selected));
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
									],
								},
							},
						})}
					/>
				);
				fireEvent.click(screen.getByLabelText(selected));
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
			const apple = getRadioButtonA();

			fireEvent.click(apple);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(apple).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "Apple";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			const apple = getRadioButtonA();
			const berry = getRadioButtonB();

			fireEvent.click(berry);
			await waitFor(() => fireEvent.click(getResetButton()));
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(apple).toBeChecked();
			expect(berry).not.toBeChecked();
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});
});
