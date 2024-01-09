import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { INumericFieldSchema } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/types";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	TOverrideField,
	TOverrideSchema,
	getErrorMessage,
	getField,
	getResetButton,
	getResetButtonProps,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../../common";
import { labelTestSuite } from "../../../common/tests";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Numeric field";
const UI_TYPE = "numeric-field";
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: COMPONENT_LABEL,
					uiType: UI_TYPE,
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: TOverrideField<INumericFieldSchema>, overrideSchema?: TOverrideSchema) => {
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

const getNumericField = (): HTMLElement => {
	return getField("spinbutton", COMPONENT_LABEL);
};

describe(UI_TYPE, () => {
	const EXPECTED_NUMBER = 10;
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getNumericField()).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent();

		expect(getNumericField()).toHaveAttribute("inputMode", "numeric");
	});

	it("should apply min attribute if min validation is specified", () => {
		renderComponent({ validation: [{ min: 5 }] });

		expect(getNumericField()).toHaveAttribute("min", "5");
	});

	it("should apply max attribute if max validation is specified", () => {
		renderComponent({ validation: [{ max: 5 }] });

		expect(getNumericField()).toHaveAttribute("max", "5");
	});

	it("should support default value", async () => {
		const defaultValue = 1;
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue(defaultValue)).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should pass other props into the field", () => {
		renderComponent({
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getNumericField()).toHaveAttribute("placeholder", "placeholder");
		expect(getNumericField()).toHaveAttribute("readOnly");
		expect(getNumericField()).toBeDisabled();
	});

	it("should not prevent copy and paste if `preventCopyAndPaste` is false", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: false,
			},
		});
		const textField = getNumericField();
		textField.focus();
		await waitFor(() => userEvent.paste(`${EXPECTED_NUMBER}`));
		expect(textField).toHaveValue(EXPECTED_NUMBER);
	});

	it("should prevent copy and paste if `preventCopyAndPaste` is true", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: true,
			},
		});
		const textField = getNumericField();
		textField.focus();
		await waitFor(() => userEvent.paste(`${EXPECTED_NUMBER}`));
		expect(textField).toHaveValue(null);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should allow drag and drop number into field if preventDragAndDrop is not true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: true,
			},
		});
		const textField = getNumericField();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_NUMBER } });
		expect(textField).toHaveValue(EXPECTED_NUMBER);
		expect(event).toBe(false);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should prevent drag & drop number into field if preventDragAndDrop is true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: false,
			},
		});
		const textField = getNumericField();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_NUMBER } });
		expect(event).toBe(true);
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getNumericField(), { target: { value: 1 } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getNumericField()).toHaveValue(null);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = 1;
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getNumericField(), { target: { value: 2 } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getNumericField()).toHaveValue(defaultValue);
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
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

		it("should set form state as dirty if user modifies the field", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.change(getNumericField(), { target: { value: 1 } });
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: 2 } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.change(getNumericField(), { target: { value: 1 } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: 2 } }}
					onClick={handleClick}
				/>
			);
			fireEvent.change(getNumericField(), { target: { value: 1 } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
});
