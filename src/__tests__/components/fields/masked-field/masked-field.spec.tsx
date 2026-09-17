import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { FrontendEngine } from "../../../../components";
import { IMaskedFieldSchema } from "../../../../components/fields";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../../components/types";
import { RegexHelper } from "../../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
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
const COMPONENT_LABEL = "Masked field";
const UI_TYPE = "masked-field";
const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[COMPONENT_ID]: {
					label: COMPONENT_LABEL,
					uiType: UI_TYPE,
					maskRange: [0, 100],
				},
				...getSubmitButtonProps(),
				...getResetButtonProps(),
			},
		},
	},
};

const renderComponent = (overrideField?: Partial<IMaskedFieldSchema> | undefined, overrideSchema?: TOverrideSchema) => {
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
		const withoutMaskRegex: IFrontendEngineData = merge(cloneDeep(JSON_SCHEMA), {
			defaultValues: { [COMPONENT_ID]: maliciousValue },
		});
		const { rerender } = render(<FrontendEngine data={withoutMaskRegex} onSubmit={SUBMIT_FN} />);

		const withMaskRegex: IFrontendEngineData = cloneDeep(withoutMaskRegex);
		merge(withMaskRegex, {
			sections: { section: { children: { [COMPONENT_ID]: { maskRange: null, maskRegex: "/^(a+)+$/" } } } },
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

	it("should pass other props into the field", () => {
		renderComponent({
			placeholder: "placeholder",
			readOnly: true,
			disabled: true,
		});

		expect(getMaskedField()).toHaveAttribute("placeholder", "placeholder");
		expect(getMaskedField()).toHaveAttribute("readonly");
		expect(getMaskedField()).toBeDisabled();
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
			fireEvent.change(getMaskedField(), { target: { value: "world" } });
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
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

		it("should reset and revert form dirty state to false", () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
			fireEvent.change(getMaskedField(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
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
			fireEvent.change(getMaskedField(), { target: { value: "world" } });
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});

	labelTestSuite(renderComponent);
	warningTestSuite({ label: COMPONENT_LABEL, uiType: UI_TYPE, maskRange: [0, 100] });
});
