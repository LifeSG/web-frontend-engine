import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IEmailFieldSchema } from "../../../../components/fields";
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
const COMPONENT_LABEL = "Email";
const UI_TYPE = "email-field";
const EXPECTED_VALUE = "aa@aa.com";
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

const renderComponent = (overrideField?: TOverrideField<IEmailFieldSchema>, overrideSchema?: TOverrideSchema) => {
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

const getEmailField = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

describe(UI_TYPE, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getEmailField()).toBeInTheDocument();
	});

	it("should validate email format", async () => {
		renderComponent();

		fireEvent.change(getEmailField(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText("Invalid email address")).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply inputMode according to its type", () => {
		renderComponent();

		expect(getEmailField()).toHaveAttribute("inputMode", "email");
	});

	it("should apply maxLength attribute if max validation is specified", () => {
		renderComponent({ validation: [{ max: 5 }] });

		expect(getEmailField()).toHaveAttribute("maxLength", "5");
	});

	it("should apply maxLength attribute if length validation is specified", () => {
		renderComponent({ validation: [{ length: 5 }] });

		expect(getEmailField()).toHaveAttribute("maxLength", "5");
	});

	it("should support default value", async () => {
		const defaultValue = "john@doe.tld";
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

		expect(getEmailField()).toHaveAttribute("placeholder", "placeholder");
		expect(getEmailField()).toHaveAttribute("readOnly");
		expect(getEmailField()).toBeDisabled();
	});

	it("should not prevent copy and paste if `preventCopyAndPaste` is false", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: false,
			},
		});
		const textField = getEmailField();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_VALUE));
		expect(textField).toHaveValue(EXPECTED_VALUE);
	});

	it("should prevent copy and paste if `preventCopyAndPaste` is true", async () => {
		renderComponent({
			customOptions: {
				preventCopyAndPaste: true,
			},
		});
		const textField = getEmailField();
		textField.focus();
		await waitFor(() => userEvent.paste(EXPECTED_VALUE));
		expect(textField).toHaveValue("");
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should allow drag and drop email into field if preventDragAndDrop is not true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: true,
			},
		});
		const textField = getEmailField();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_VALUE } });
		expect(textField).toHaveValue(EXPECTED_VALUE);
		expect(event).toBe(false);
	});

	// testing the return value of drop event because @testing-library/user-event does not respect preventDefault()
	it("should prevent drag & drop email into field if preventDragAndDrop is true", () => {
		renderComponent({
			customOptions: {
				preventDragAndDrop: false,
			},
		});
		const textField = getEmailField();
		const event = fireEvent.drop(textField, { target: { value: EXPECTED_VALUE } });
		expect(event).toBe(true);
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getEmailField(), { target: { value: "john@doe.com" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getEmailField()).toHaveValue("");
			expect(SUBMIT_FN).toBeCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "john@doe.com";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getEmailField(), { target: { value: "lorem@ipsum.com" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getEmailField()).toHaveValue(defaultValue);
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
			fireEvent.change(getEmailField(), { target: { value: "world" } });
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "john@doe.tld" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.change(getEmailField(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "john@doe.tld" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.change(getEmailField(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
});
