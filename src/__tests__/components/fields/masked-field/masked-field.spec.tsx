import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { IMaskedFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { IFrontendEngineData } from "../../../../components/types";
import { RegexHelper } from "../../../../utils";
import {
	ERROR_MESSAGE,
	createRenderComponent,
	getErrorMessage,
	getField,
	getResetButton,
	getSubmitButton,
} from "../../../common";
import { dirtyStateTestSuite, labelTestSuite, warningTestSuite } from "../../../common/tests";

const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const COMPONENT_LABEL = "Masked field";
const UI_TYPE = "masked-field";

const { renderComponent, schema } = createRenderComponent<IMaskedFieldSchema>({
	componentId: COMPONENT_ID,
	baseSchema: {
		label: COMPONENT_LABEL,
		uiType: UI_TYPE,
		maskRange: [0, 100],
	},
	submitFn: SUBMIT_FN,
});

const getMaskedField = (): HTMLElement => {
	return getField("textbox", COMPONENT_LABEL);
};

describe(UI_TYPE, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should be able to render the field", () => {
		renderComponent();

		expect(getMaskedField()).toBeInTheDocument();
	});

	it("should support validation schema", async () => {
		renderComponent({ validation: [{ required: true, errorMessage: ERROR_MESSAGE }] });

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(getErrorMessage()).toBeInTheDocument();
	});

	it("should apply maxLength attribute if max validation is specified", () => {
		renderComponent({ validation: [{ max: 5 }] });

		expect(getMaskedField()).toHaveAttribute("maxLength", "5");
	});

	it("should apply maxLength attribute if length validation is specified", () => {
		renderComponent({ validation: [{ length: 5 }] });

		expect(getMaskedField()).toHaveAttribute("maxLength", "5");
	});

	it("should default maxLength to the safe regex length bound when maskRegex is set with no max/length validation", () => {
		renderComponent({ maskRange: null, maskRegex: "/^(hello)/g" });

		expect(getMaskedField()).toHaveAttribute("maxLength", `${RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH}`);
	});

	it("should prefer an explicit max/length validation's maxLength over the maskRegex default", () => {
		renderComponent({ maskRange: null, maskRegex: "/^(hello)/g", validation: [{ max: 5 }] });

		expect(getMaskedField()).toHaveAttribute("maxLength", "5");
	});

	it("should not hang on a pathological maskRegex when a long value arrives via defaultValues (bypassing the maxLength DOM attribute)", () => {
		// the maxLength attribute only constrains typing through the native input — a defaultValue is set
		// directly on stateValue and handed to MaskedInput regardless of that attribute, so the length bound
		// must also be applied when the value is set programmatically, not just derived as a DOM attribute
		const maliciousValue = `${"a".repeat(600)}!`;

		const start = Date.now();
		renderComponent(
			{ maskRange: null, maskRegex: "/^(a+)+$/" },
			{ defaultValues: { [COMPONENT_ID]: maliciousValue } }
		);
		expect(Date.now() - start).toBeLessThan(1000);

		expect((getMaskedField() as HTMLInputElement).value.length).toBeLessThanOrEqual(
			RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH
		);
	});

	it("should clamp an already-loaded long value at render time when maskRegex changes at runtime, not only when the value itself changes", () => {
		// the effect that clamps stateValue is keyed on [safeLength, value] — but the render that
		// introduces a new maskRegex happens before that effect runs. If MaskedInput were handed the
		// unclamped stateValue on that render, a pathological pattern could reach it before the effect
		// has any chance to shorten the value, so the render itself must derive a clamped value directly
		const maliciousValue = `${"a".repeat(600)}!`;
		const withoutMaskRegex: IFrontendEngineData = JSON.parse(JSON.stringify(schema));
		Object.assign(withoutMaskRegex, { defaultValues: { [COMPONENT_ID]: maliciousValue } });
		const { rerender } = render(<FrontendEngine data={withoutMaskRegex} onSubmit={SUBMIT_FN} />);

		const withMaskRegex: IFrontendEngineData = JSON.parse(JSON.stringify(withoutMaskRegex));
		Object.assign(withMaskRegex.sections.section.children[COMPONENT_ID] as object, {
			maskRange: null,
			maskRegex: "/^(a+)+$/",
		});

		const start = Date.now();
		rerender(<FrontendEngine data={withMaskRegex} onSubmit={SUBMIT_FN} />);
		expect(Date.now() - start).toBeLessThan(1000);

		expect((getMaskedField() as HTMLInputElement).value.length).toBeLessThanOrEqual(
			RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH
		);
	});

	it("should reject an oversized programmatic value with a validation error when maskRegex is set but no explicit max/length rule governs the length", async () => {
		const oversizedValue = "a".repeat(RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH + 1);
		renderComponent(
			{ maskRange: null, maskRegex: "/^(hello)/g" },
			{ defaultValues: { [COMPONENT_ID]: oversizedValue } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(
			getErrorMessage(
				false,
				ERROR_MESSAGES.MASKED_FIELD.VALUE_TOO_LONG(RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH)
			)
		).toBeInTheDocument();
		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should not reject an oversized value when an explicit max validation rule already permits that length", async () => {
		const value = "a".repeat(RegexHelper.MAX_SAFE_PATTERN_INPUT_LENGTH + 1);
		renderComponent(
			{ maskRange: null, maskRegex: "/^(hello)/g", validation: [{ max: 1000 }] },
			{ defaultValues: { [COMPONENT_ID]: value } }
		);

		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: value }));
	});

	it("should support default value", async () => {
		const defaultValue = "hello";
		renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

		expect(screen.getByDisplayValue("•••••")).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should pass disabled and placeholder props into the field", () => {
		renderComponent({
			placeholder: "placeholder",
			disabled: true,
		});

		expect(getMaskedField()).toHaveAttribute("placeholder", "placeholder");
		expect(getMaskedField()).toHaveAttribute("aria-disabled", "true");
	});

	it("should render masked readonly state when readOnly is true", () => {
		renderComponent({ readOnly: true });

		expect(screen.getByTestId("masked-input-readonly-button")).toBeInTheDocument();
	});

	it("should mask based on regex", async () => {
		const defaultValue = "hellohello";
		renderComponent(
			{ maskRange: null, maskRegex: "/^(hello)/g" },
			{ defaultValues: { [COMPONENT_ID]: defaultValue } }
		);

		expect(screen.getByDisplayValue("•hello")).toBeInTheDocument();

		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
	});

	it("should not throw when maskRegex is malformed", () => {
		expect(() =>
			renderComponent(
				{ maskRange: null, maskRegex: "not a /pattern/flags string [" },
				{ defaultValues: { [COMPONENT_ID]: "hello" } }
			)
		).not.toThrow();
	});

	it("should render custom icons", () => {
		const maskIcon = "AlbumFillIcon";
		const unmaskIcon = "AlbumIcon";
		renderComponent({ iconMask: maskIcon, iconUnmask: unmaskIcon }, { defaultValues: { [COMPONENT_ID]: "hello" } });

		expect(screen.getByTestId(unmaskIcon)).toBeInTheDocument();

		fireEvent.click(screen.getByTestId("icon-masked"));

		expect(screen.getByTestId(maskIcon)).toBeInTheDocument();
	});

	describe("reset", () => {
		it("should clear selection on reset", async () => {
			renderComponent();

			fireEvent.change(getMaskedField(), { target: { value: "hello" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(getMaskedField()).toHaveValue("");
			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: undefined }));
		});

		it("should revert to default value on reset", async () => {
			const defaultValue = "hello";
			renderComponent(undefined, { defaultValues: { [COMPONENT_ID]: defaultValue } });

			fireEvent.change(getMaskedField(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(SUBMIT_FN).toHaveBeenCalledWith(expect.objectContaining({ [COMPONENT_ID]: defaultValue }));
		});
	});

	dirtyStateTestSuite({
		schema,
		componentId: COMPONENT_ID,
		defaultValue: "hello",
		modifyField: () => fireEvent.change(getMaskedField(), { target: { value: "world" } }),
	});

	labelTestSuite(renderComponent);
	warningTestSuite({ label: COMPONENT_LABEL, uiType: UI_TYPE, maskRange: [0, 100] });
});
