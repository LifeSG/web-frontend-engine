import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IContactNumberSchema, TSingaporeNumberRule } from "../../../../components/fields";
import { IFrontendEngineData } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { TestHelper } from "../../../../utils";
import { ERROR_MESSAGE, SUBMIT_BUTTON_ID, TOverrideField, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "contact";
const componentTestId = TestHelper.generateId(componentId, fieldType);

const renderComponent = (overrideField?: TOverrideField<IContactNumberSchema>, overrideSchema?: TOverrideSchema) => {
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			[componentId]: {
				label: "Contact",
				fieldType,
				...overrideField,
			},
			submit: {
				label: "Submit",
				fieldType: "submit",
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

describe(fieldType, () => {
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();
		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
	});

	it("should be able to support default country", async () => {
		renderComponent({ country: "Japan" });

		expect(screen.getByText("+81")).toBeInTheDocument();
	});

	it("should be able to support validation schema", async () => {
		renderComponent({
			validation: [{ required: true, errorMessage: ERROR_MESSAGE }],
		});

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
	});

	it("should be disabled if configured", async () => {
		renderComponent({ disabled: true });

		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: undefined }));
	});

	it("should be able to select another country code", async () => {
		renderComponent();

		const dropdownToggle = screen.getByTestId("addon-selector");
		await waitFor(() => fireEvent.click(dropdownToggle));

		const countryCodes = screen.getAllByTestId("list-item");
		const afghanCode = countryCodes.find((country) => country.textContent === "Afghanistan (+93)");
		await waitFor(() => fireEvent.click(afghanCode));

		expect(screen.getByText("+93")).toBeInTheDocument();
	});

	it("should be able to support custom placeholder", async () => {
		const placeholder = "custom placeholder";
		renderComponent({ placeholder });

		const input = screen.getByTestId(componentTestId);

		expect(input).toHaveAttribute("placeholder", placeholder);
	});

	it("should be able to support search bar", async () => {
		renderComponent({ enableSearch: true });

		const dropdownToggle = screen.getByTestId("addon-selector");
		await waitFor(() => fireEvent.click(dropdownToggle));

		expect(screen.getByTestId("search-input")).toBeInTheDocument();
	});

	describe("it should be able to verify Singapore numbers", () => {
		it("+65 98123456 should be a valid number", async () => {
			const contactNumber = "98123456";
			renderComponent({ validation: [{ contactNumber: { singaporeNumber: "default" } }] });

			// NOTE: If singaporeNumber rule is enabled, HTML element renders differently from others
			const input = screen.getByTestId(componentTestId).querySelector("input");
			fireEvent.change(input, { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: `+65 ${contactNumber}` }));
		});

		it("+65 12345678 should be an invalid number", async () => {
			const contactNumber = "12345678";
			renderComponent({ validation: [{ contactNumber: { singaporeNumber: "default" } }] });

			const input = screen.getByTestId(componentTestId).querySelector("input");
			fireEvent.change(input, { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER)).toBeInTheDocument();
		});

		it.each`
			validationType | contactNumber | expected
			${"house"}     | ${"67661234"} | ${"+65 67661234"}
			${"house"}     | ${"98123456"} | ${"error"}
			${"mobile"}    | ${"98123456"} | ${"+65 98123456"}
			${"mobile"}    | ${"67661234"} | ${"error"}
		`(
			"should support validation for house and phone numbers",
			async ({ validationType, contactNumber, expected }) => {
				const isHouseValidation = validationType === "house";
				const singaporeRule: TSingaporeNumberRule = isHouseValidation ? "house" : "mobile";
				renderComponent({
					validation: [{ contactNumber: { singaporeNumber: singaporeRule } }],
				});

				const input = screen.getByTestId(componentTestId).querySelector("input");
				fireEvent.change(input, { target: { value: contactNumber } });
				await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

				if (expected === "error") {
					expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_SINGAPORE_NUMBER)).toBeInTheDocument();
				} else {
					expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: `+65 ${contactNumber}` }));
				}
			}
		);
	});

	describe("it should be able to verify International numbers", () => {
		it("+81 97-958-4362  should be a valid number", async () => {
			const contactNumber = "97-958-4362 ";
			renderComponent({ validation: [{ contactNumber: { internationalNumber: true } }] });

			const countryCodes = screen.getAllByTestId("list-item");
			const japanCode = countryCodes.find((country) => country.textContent === "Japan (+81)");
			await waitFor(() => fireEvent.click(japanCode));

			const input = screen.getByTestId(componentTestId);
			fireEvent.change(input, { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(submitFn).toBeCalledWith(expect.objectContaining({ [componentId]: `+81 ${contactNumber}` }));
		});

		it("+81 12345678  should be an invalid number", async () => {
			const contactNumber = "12345678";
			renderComponent({ validation: [{ contactNumber: { internationalNumber: true } }] });

			const countryCodes = screen.getAllByTestId("list-item");
			const japanCode = countryCodes.find((country) => country.textContent === "Japan (+81)");
			await waitFor(() => fireEvent.click(japanCode));

			const input = screen.getByTestId(componentTestId);
			fireEvent.change(input, { target: { value: contactNumber } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			expect(screen.getByText(ERROR_MESSAGES.CONTACT.INVALID_INTERNATIONAL_NUMBER)).toBeInTheDocument();
		});
	});
});
