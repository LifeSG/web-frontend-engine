import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { setupJestCanvasMock } from "jest-canvas-mock";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IContactFieldSchema, TSingaporeNumberRule } from "../../../../components/fields";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
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
import { warningTestSuite } from "../../../common/tests/warnings";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "contact-field";
const COMPONENT_LABEL = "Contact Number";
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

jest.setTimeout(20000);

const renderComponent = (overrideField?: TOverrideField<IContactFieldSchema>, overrideSchema?: TOverrideSchema) => {
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

const getContactField = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

const getDefaultDropdownToggle = (): HTMLElement => {
	return screen.getByTestId("addon-selector");
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

		expect(getContactField()).toBeInTheDocument();
	});

	it("should be able to support default country", async () => {
		renderComponent({ defaultCountry: "Japan" });
		expect(screen.getByText("+81")).toBeInTheDocument();
	});

	it("should be able to support validation schema", async () => {
		renderComponent({
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should be able to select another country code", async () => {
		renderComponent();

		await waitFor(() => fireEvent.click(getDefaultDropdownToggle()));

		const afghanCode = getField("button", "Afghanistan +93");
		await waitFor(() => fireEvent.click(afghanCode));

		expect(screen.getByText("+93")).toBeInTheDocument();
	});

	it("should be able to support custom placeholder", async () => {
		const placeholder = "custom placeholder";
		renderComponent({ placeholder });

		expect(getContactField()).toHaveAttribute("placeholder", placeholder);
	});

	it("should be able to support search bar", async () => {
		renderComponent({ enableSearch: true });

		await waitFor(() => fireEvent.click(getDefaultDropdownToggle()));

		expect(getField("textbox", "search-input")).toBeInTheDocument();
	});

	describe("defaultValues", () => {
		it("should support defaultValues", async () => {
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: "+65 91234567" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "+65 91234567" }));
		});

		it("should prepend country code if not specified in defaultValues", async () => {
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: "91234567" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "+65 91234567" }));
		});

		it("should switch country if another country code is specified in defaultValues", async () => {
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: "+60 91234567" } });

			expect(screen.getByText("+60")).toBeInTheDocument();
		});

		it("should support format phone number without spaces", async () => {
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: "+84327016340" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "+84 327016340" }));
		});

		it("should not switch country if an invalid country code is specified in defaultValues", async () => {
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: "+999 91234567" } });

			expect(screen.getByText("+65")).toBeInTheDocument();
		});

		it("should not use defaultValues if field has fixed country yet another country number is provided", async () => {
			renderComponent(
				{
					validation: [
						{
							contactNumber: {
								internationalNumber: "Ireland",
							},
						},
					],
				},
				{ defaultValues: { [COMPONENT_ID]: "+65 91234567" } }
			);
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "" }));
		});
	});

	it("should not apply phone number validation if no validation rule is provided", async () => {
		const contactNumber = "1234";
		renderComponent();
		fireEvent.change(getContactField(), { target: { value: contactNumber } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: `+65 ${contactNumber}` }));
	});

	describe("it should be able to verify Singapore numbers", () => {
		it("+65 98123456 should be a valid number", async () => {
			const contactNumber = "98123456";
			renderComponent({ validation: [{ contactNumber: { singaporeNumber: "default" } }] });
			fireEvent.change(getContactField(), { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: `+65 ${contactNumber}` }));
		});
		it("+65 12345678 should be an invalid number", async () => {
			const contactNumber = "12345678";
			renderComponent({ validation: [{ contactNumber: { singaporeNumber: "default" } }] });
			fireEvent.change(getContactField(), { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER)).toBeInTheDocument();
		});
		it.each`
			validationType | contactNumber | expected
			${"default"}   | ${"37661234"} | ${"+65 37661234"}
			${"default"}   | ${"67661234"} | ${"+65 67661234"}
			${"default"}   | ${"87661234"} | ${"+65 87661234"}
			${"default"}   | ${"97661234"} | ${"+65 97661234"}
			${"house"}     | ${"67661234"} | ${"+65 67661234"}
			${"house"}     | ${"37661234"} | ${"error"}
			${"house"}     | ${"88123456"} | ${"error"}
			${"house"}     | ${"98123456"} | ${"error"}
			${"mobile"}    | ${"88123456"} | ${"+65 88123456"}
			${"mobile"}    | ${"98123456"} | ${"+65 98123456"}
			${"mobile"}    | ${"37661234"} | ${"error"}
			${"mobile"}    | ${"67661234"} | ${"error"}
		`(
			"$contactNumber ($validationType number) should return $expected",
			async ({ validationType, contactNumber, expected }) => {
				renderComponent({
					validation: [{ contactNumber: { singaporeNumber: validationType } }],
				});
				fireEvent.change(getContactField(), { target: { value: contactNumber } });
				await waitFor(() => fireEvent.click(getSubmitButton()));

				if (expected === "error") {
					expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER)).toBeInTheDocument();
				} else {
					expect(SUBMIT_FN).toHaveBeenCalledWith(
						expect.objectContaining({ [COMPONENT_ID]: `+65 ${contactNumber}` })
					);
				}
			}
		);
	});

	describe("it should be able to verify International numbers", () => {
		it("+81 979584362 should be a valid number", async () => {
			const contactNumber = "979584362";
			renderComponent({ validation: [{ contactNumber: { internationalNumber: true } }] });

			await waitFor(() => fireEvent.click(getDefaultDropdownToggle()));

			const japanCode = getField("button", "Japan +81");

			await waitFor(() => fireEvent.click(japanCode));
			fireEvent.change(getContactField(), { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: `+81 ${contactNumber}` }));
		});

		it("+81 12-345-678 should be an invalid number", async () => {
			const contactNumber = "12-345-678";
			renderComponent({ validation: [{ contactNumber: { internationalNumber: true } }] });

			await waitFor(() => fireEvent.click(getDefaultDropdownToggle()));

			const japanCode = getField("button", "Japan +81");

			await waitFor(() => fireEvent.click(japanCode));
			fireEvent.change(getContactField(), { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_INTERNATIONAL_NUMBER)).toBeInTheDocument();
		});

		it("should validate against specific country when specified", async () => {
			const contactNumber = "512345678";
			const country = "France";

			renderComponent({
				validation: [
					{
						contactNumber: {
							internationalNumber: country,
						},
					},
				],
			});

			fireEvent.change(getContactField(), { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: `+33 ${contactNumber}` }));
		});

		it("should fix the country selection if there is singaporeNumber validation", async () => {
			renderComponent({
				validation: [
					{
						contactNumber: {
							singaporeNumber: "mobile",
						},
					},
				],
			});

			expect(screen.queryByTestId("addon-selector")).not.toBeInTheDocument();
			expect(screen.getByTestId("addon")).toBeInTheDocument();
		});

		it("should fix the specific country if internationalNumber validation has a specific country", async () => {
			const country = "Denmark";

			renderComponent({
				validation: [
					{
						contactNumber: {
							internationalNumber: country,
						},
					},
				],
			});

			expect(screen.queryByTestId("addon-selector")).not.toBeInTheDocument();
			expect(screen.getByTestId("addon")).toBeInTheDocument();
		});

		it("should not fix the country selection if internationalNumber validation does not have a specific country", async () => {
			renderComponent({
				validation: [
					{
						contactNumber: {
							internationalNumber: true,
						},
					},
				],
			});

			expect(screen.getByTestId("addon-selector")).toBeInTheDocument();
			expect(screen.queryByTestId("addon")).not.toBeInTheDocument();
		});

		it("should reject if number format does not match specified country", async () => {
			const contactNumber = "012345678";
			const country = "France";

			renderComponent({
				validation: [
					{
						contactNumber: {
							internationalNumber: country,
						},
					},
				],
			});

			fireEvent.change(getContactField(), { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_INTERNATIONAL_NUMBER)).toBeInTheDocument();
		});
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getContactField(), { target: { value: "91234567" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getContactField()).toHaveValue("");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: "" }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValues = "+65 91234567";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValues } });

			fireEvent.change(getContactField(), { target: { value: "987654321" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getContactField()).toHaveValue("9123 4567");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValues }));
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
			fireEvent.change(getContactField(), { target: { value: "+65 91234567" } });
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "91234567" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.change(getContactField(), { target: { value: "+65 91234567" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...JSON_SCHEMA, defaultValues: { [COMPONENT_ID]: "91234567" } }}
					onClick={handleClick}
				/>
			);
			fireEvent.change(getContactField(), { target: { value: "+65 91234567" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
	warningTestSuite<IContactFieldSchema>({ label: COMPONENT_LABEL, uiType: UI_TYPE });
});
