import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import isEqual from "lodash/isEqual";
import merge from "lodash/merge";
import { useRef, useState } from "react";
import { FrontendEngine } from "../../../components";
import { ITextFieldSchema } from "../../../components/fields";
import { ERROR_MESSAGES } from "../../../components/shared";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/types";
import { IYupValidationRule } from "../../../context-providers";
import { SUBMIT_BUTTON_SCHEMA } from "../../../stories/common";
import { TestHelper } from "../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
	flushPromise,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../common";

const UI_TYPE = "text-field";
const FIELD_ONE_ID = "field1";
const FIELD_ONE_LABEL = "Field 1";
const FIELD_TWO_ID = "field2";
const FIELD_TWO_LABEL = "Field 2";
const CUSTOM_BUTTON_LABEL = "Custom Button";
const COMPONENT_TEST_ID = TestHelper.generateId(FRONTEND_ENGINE_ID, "frontend-engine");
const ERROR_MESSAGE_2 = "error message 2";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[FIELD_ONE_ID]: {
					label: FIELD_ONE_LABEL,
					uiType: UI_TYPE,
					validation: [
						{ required: true, errorMessage: ERROR_MESSAGE },
						{ min: 2, errorMessage: ERROR_MESSAGE },
					],
				},
				...getSubmitButtonProps(),
			},
		},
	},
};

const NESTED_JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	sections: {
		section: {
			uiType: "section",
			children: {
				[FIELD_ONE_ID]: {
					uiType: "div",
					children: {
						header: {
							uiType: "h6",
							children: "Fill in your name below",
						},
						[FIELD_TWO_ID]: {
							label: FIELD_TWO_LABEL,
							uiType: UI_TYPE,
							validation: [{ required: true }],
						},
						...getSubmitButtonProps(),
					},
				},
			},
		},
	},
};

const MULTI_FIELD_SCHEMA = merge(cloneDeep(JSON_SCHEMA), {
	sections: {
		section: {
			children: {
				[FIELD_TWO_ID]: {
					label: FIELD_TWO_LABEL,
					uiType: UI_TYPE,
					validation: [{ required: true, errorMessage: ERROR_MESSAGE_2 }],
				},
			},
		},
	},
});

const getFieldOne = (): HTMLElement => {
	return getField("textbox", FIELD_ONE_LABEL);
};

const getFieldTwo = (): HTMLElement => {
	return getField("textbox", FIELD_TWO_LABEL);
};

const getCustomButton = (): HTMLElement => {
	return screen.getByRole("button", { name: CUSTOM_BUTTON_LABEL });
};

const renderComponent = (
	overrideProps?: Partial<IFrontendEngineProps>,
	overrideData?: Partial<IFrontendEngineData>
) => {
	const json: IFrontendEngineData = {
		...JSON_SCHEMA,
		...overrideData,
		sections: {
			section: {
				...JSON_SCHEMA.sections.section,
				...overrideData?.sections?.section,
			},
		},
	};
	return render(<FrontendEngine {...overrideProps} data={json} />);
};

describe("frontend-engine", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should render a form with JSON provided", () => {
		renderComponent();

		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
		expect(getFieldOne()).toBeInTheDocument();
	});

	describe.each`
		wrapInForm   | element
		${undefined} | ${"form"}
		${true}      | ${"form"}
		${false}     | ${"div"}
	`("when wrapInForm=$wrapInForm", ({ wrapInForm, element }) => {
		it(`should render the fields in a ${element}`, () => {
			renderComponent({ wrapInForm });

			expect(screen.getByTestId("test__frontend-engine").nodeName).toBe(element.toUpperCase());
		});

		describe("onChange", () => {
			const onChange = jest.fn();
			it("should be called on mount", async () => {
				renderComponent({ onChange, wrapInForm });

				await waitFor(() => expect(onChange).toHaveBeenCalled());
			});

			it("should be called on value change", async () => {
				renderComponent({ onChange, wrapInForm });
				fireEvent.change(getFieldOne(), { target: { value: "hello" } });

				await waitFor(() =>
					expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hello" }), true)
				);
			});

			it("should be called on schema change", async () => {
				const CustomFrontendEngine = () => {
					const [schema, setSchema] = useState<IFrontendEngineData>(JSON_SCHEMA);
					const handleClick = () =>
						setSchema({
							...schema,
							overrides: {
								[FIELD_ONE_ID]: { label: "New text field" },
							},
						});

					return (
						<>
							<FrontendEngine data={schema} onChange={onChange} />
							<Button.Default onClick={handleClick}>Update schema</Button.Default>
						</>
					);
				};
				render(<CustomFrontendEngine />);
				fireEvent.click(screen.getByRole("button", { name: "Update schema" }));

				await waitFor(() => expect(onChange).toHaveBeenCalled());
			});

			it("should return the correct validity when form is prefilled with valid values", async () => {
				renderComponent(
					{ onChange },
					{
						sections: {
							section: {
								uiType: "section",
								children: {
									[FIELD_ONE_ID]: {
										uiType: "text-field",
										label: FIELD_ONE_LABEL,
										validation: [{ required: true }],
									},
								},
							},
						},
						defaultValues: { [FIELD_ONE_ID]: "a" },
					}
				);

				await waitFor(() =>
					expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "a" }), true)
				);
			});

			it("should return the correct validity when form is prefilled with invalid values", async () => {
				renderComponent(
					{ onChange },
					{
						sections: {
							section: {
								uiType: "section",
								children: {
									[FIELD_ONE_ID]: {
										uiType: "text-field",
										label: FIELD_ONE_LABEL,
										validation: [{ min: 5 }],
									},
								},
							},
						},
						defaultValues: { [FIELD_ONE_ID]: "a" },
					}
				);

				await waitFor(() =>
					expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "a" }), false)
				);
			});

			it("should include form values of unregistered fields if stripUnknown is not true", async () => {
				renderComponent({ onChange }, { ...JSON_SCHEMA, defaultValues: { nonExistentField: "hello world" } });
				fireEvent.change(getFieldOne(), { target: { value: "hello" } });

				await flushPromise();
				const finalOnChangeCall = onChange.mock.lastCall[0];
				expect(finalOnChangeCall).toEqual({
					[FIELD_ONE_ID]: "hello",
					nonExistentField: "hello world",
					submit: undefined,
				});
			});

			it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
				renderComponent(
					{ onChange },
					{ ...JSON_SCHEMA, stripUnknown: true, defaultValues: { nonExistentField: "hello world" } }
				);
				fireEvent.change(getFieldOne(), { target: { value: "hello" } });

				await waitFor(() => expect(onChange).toHaveBeenCalled());
				const finalOnChangeCall = onChange.mock.lastCall[0];
				expect(finalOnChangeCall).toEqual({
					[FIELD_ONE_ID]: "hello",
					submit: undefined,
				});
			});
		});

		describe("onValueChange", () => {
			const onValueChange = jest.fn();
			it("should not be called on mount", async () => {
				renderComponent({ onValueChange, wrapInForm });
				await flushPromise();

				expect(onValueChange).not.toHaveBeenCalled();
			});

			it("should be called on value change", async () => {
				renderComponent({ onValueChange, wrapInForm });
				fireEvent.change(getFieldOne(), { target: { value: "hello" } });

				await waitFor(() =>
					expect(onValueChange).toHaveBeenCalledWith(
						expect.objectContaining({ [FIELD_ONE_ID]: "hello" }),
						true
					)
				);
			});

			it("should not be called when form values do not change", async () => {
				const CustomFrontendEngine = () => {
					const [schema, setSchema] = useState<IFrontendEngineData>(
						merge(cloneDeep(JSON_SCHEMA), {
							sections: {
								section: {
									children: {
										element: { uiType: "alert", children: "original" },
									},
								},
							},
						})
					);
					const handleClick = () =>
						setSchema({
							...schema,
							overrides: {
								section: {
									children: {
										element: { children: "overridden" },
									},
								},
							},
						});
					return (
						<>
							<FrontendEngine data={schema} onValueChange={onValueChange} />
							<Button.Default onClick={handleClick}>Update schema</Button.Default>
						</>
					);
				};
				render(<CustomFrontendEngine />);
				fireEvent.click(screen.getByRole("button", { name: "Update schema" }));
				await flushPromise();

				expect(onValueChange).not.toHaveBeenCalled();
			});

			it("should be called on validity change", async () => {
				const CustomFrontendEngine = () => {
					const [schema, setSchema] = useState<IFrontendEngineData>(JSON_SCHEMA);
					const handleClick = () =>
						setSchema({
							...schema,
							overrides: {
								[FIELD_ONE_ID]: {
									validation: [
										{ required: true, errorMessage: ERROR_MESSAGE },
										{ min: 1, errorMessage: ERROR_MESSAGE_2 },
									],
								},
							},
						});
					return (
						<>
							<FrontendEngine data={schema} onValueChange={onValueChange} />
							<Button.Default onClick={handleClick}>Update schema</Button.Default>
						</>
					);
				};
				render(<CustomFrontendEngine />);
				fireEvent.change(getFieldOne(), { target: { value: "1" } });

				await waitFor(() =>
					expect(onValueChange).toHaveBeenLastCalledWith(
						expect.objectContaining({ [FIELD_ONE_ID]: "1" }),
						false
					)
				);

				fireEvent.click(screen.getByRole("button", { name: "Update schema" }));

				await waitFor(() =>
					expect(onValueChange).toHaveBeenLastCalledWith(
						expect.objectContaining({ [FIELD_ONE_ID]: "1" }),
						true
					)
				);
			});

			it("should include form values of unregistered fields if stripUnknown is not true", async () => {
				renderComponent(
					{ onValueChange },
					{ ...JSON_SCHEMA, defaultValues: { nonExistentField: "hello world" } }
				);
				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				await flushPromise();

				const finalOnChangeCall = onValueChange.mock.lastCall[0];
				expect(finalOnChangeCall).toEqual({
					[FIELD_ONE_ID]: "hello",
					nonExistentField: "hello world",
					submit: undefined,
				});
			});

			it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
				renderComponent(
					{ onValueChange },
					{ ...JSON_SCHEMA, stripUnknown: true, defaultValues: { nonExistentField: "hello world" } }
				);
				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				await flushPromise();

				const finalOnChangeCall = onValueChange.mock.lastCall[0];
				expect(finalOnChangeCall).toEqual({
					[FIELD_ONE_ID]: "hello",
					submit: undefined,
				});
			});
		});

		it("should call onSubmitError prop and not onSubmit prop on submit with validation error(s)", async () => {
			const onSubmit = jest.fn();
			const onSubmitError = jest.fn();
			renderComponent({
				onSubmit,
				onSubmitError,
				wrapInForm,
			});

			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(onSubmitError).toBeCalledWith({
				[FIELD_ONE_ID]: {
					message: ERROR_MESSAGE,
					ref: expect.anything(),
					type: expect.anything(),
				},
			});
			expect(onSubmit).not.toBeCalled();
		});

		describe("submit", () => {
			it("should submit through submit method", async () => {
				const submitFn = jest.fn();
				render(<FrontendEngine data={JSON_SCHEMA} wrapInForm={wrapInForm} onSubmit={submitFn} />);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(submitFn).toBeCalledWith({ [FIELD_ONE_ID]: "hello", submit: undefined });
			});

			it("should include form values of unregistered fields if stripUnknown is not true", async () => {
				const submitFn = jest.fn();
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
				};
				render(
					<FrontendEngineWithCustomButton
						data={{ ...JSON_SCHEMA, defaultValues: { nonExistentField: "hello world" } }}
						onClick={handleClick}
						onSubmit={submitFn}
						overrideProps={{ wrapInForm }}
					/>
				);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.click(getCustomButton());
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(submitFn).toBeCalledWith({
					[FIELD_ONE_ID]: "hello",
					nonExistentField: "hello world",
					nonExistentField2: "john doe",
					submit: undefined,
				});
			});

			it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
				const submitFn = jest.fn();
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
				};
				render(
					<FrontendEngineWithCustomButton
						data={{
							...JSON_SCHEMA,
							stripUnknown: true,
							defaultValues: { nonExistentField: "hello world" },
						}}
						onClick={handleClick}
						onSubmit={submitFn}
						overrideProps={{ wrapInForm }}
					/>
				);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.click(getCustomButton());
				await waitFor(() => fireEvent.click(getSubmitButton()));

				expect(submitFn).toBeCalledWith({
					[FIELD_ONE_ID]: "hello",
					submit: undefined,
				});
			});
		});

		it("should reset through reset method", async () => {
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.reset();
			};

			render(
				<FrontendEngineWithCustomButton
					data={JSON_SCHEMA}
					onClick={handleClick}
					overrideProps={{ wrapInForm }}
				/>
			);
			const field = getFieldOne();
			fireEvent.change(field, { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(field).toHaveValue("");
		});
	});

	describe("getValues()", () => {
		describe("no payload", () => {
			let formValues: Record<string, unknown> = {};
			it("should return form values", () => {
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					formValues = ref.current.getValues();
				};
				render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClick} />);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.change(getFieldTwo(), { target: { value: "world" } });
				fireEvent.click(getCustomButton());

				expect(formValues).toEqual({
					[FIELD_ONE_ID]: "hello",
					[FIELD_TWO_ID]: "world",
					submit: undefined,
				});
			});

			it("should include form values of unregistered fields if stripUnknown is not true", async () => {
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
					formValues = ref.current.getValues();
				};
				render(
					<FrontendEngineWithCustomButton
						data={{ ...MULTI_FIELD_SCHEMA, defaultValues: { nonExistentField: "hello world" } }}
						onClick={handleClick}
					/>
				);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.change(getFieldTwo(), { target: { value: "world" } });
				await waitFor(() => fireEvent.click(getCustomButton()));

				expect(formValues).toEqual({
					[FIELD_ONE_ID]: "hello",
					[FIELD_TWO_ID]: "world",
					nonExistentField: "hello world",
					nonExistentField2: "john doe",
					submit: undefined,
				});
			});

			it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
					formValues = ref.current.getValues();
				};
				render(
					<FrontendEngineWithCustomButton
						data={{
							...MULTI_FIELD_SCHEMA,
							stripUnknown: true,
							defaultValues: { nonExistentField: "hello world" },
						}}
						onClick={handleClick}
					/>
				);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.change(getFieldTwo(), { target: { value: "world" } });
				await waitFor(() => fireEvent.click(getCustomButton()));

				expect(formValues).toEqual({
					[FIELD_ONE_ID]: "hello",
					[FIELD_TWO_ID]: "world",
					submit: undefined,
				});
			});
		});

		describe("string payload", () => {
			it("should return form values", () => {
				let fieldOneValue: unknown;
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					fieldOneValue = ref.current.getValues(FIELD_ONE_ID);
				};
				render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClick} />);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.change(getFieldTwo(), { target: { value: "world" } });
				fireEvent.click(getCustomButton());

				expect(fieldOneValue).toEqual("hello");
			});

			it("should include form values of unregistered fields if stripUnknown is not true", async () => {
				let nonExistentField1Value: unknown;
				let nonExistentField2Value: unknown;
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
					nonExistentField1Value = ref.current.getValues("nonExistentField");
					nonExistentField2Value = ref.current.getValues("nonExistentField2");
				};
				render(
					<FrontendEngineWithCustomButton
						data={{ ...MULTI_FIELD_SCHEMA, defaultValues: { nonExistentField: "hello world" } }}
						onClick={handleClick}
					/>
				);
				await waitFor(() => fireEvent.click(getCustomButton()));

				expect(nonExistentField1Value).toEqual("hello world");
				expect(nonExistentField2Value).toEqual("john doe");
			});

			it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
				let nonExistentField1Value: unknown;
				let nonExistentField2Value: unknown;
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
					nonExistentField1Value = ref.current.getValues("nonExistentField");
					nonExistentField2Value = ref.current.getValues("nonExistentField2");
				};
				render(
					<FrontendEngineWithCustomButton
						data={{
							...MULTI_FIELD_SCHEMA,
							stripUnknown: true,
							defaultValues: { nonExistentField: "hello world" },
						}}
						onClick={handleClick}
					/>
				);
				await waitFor(() => fireEvent.click(getCustomButton()));

				expect(nonExistentField1Value).toBeUndefined();
				expect(nonExistentField2Value).toBeUndefined();
			});
		});

		describe("array payload", () => {
			let formValues: Record<string, unknown> = {};
			it("should return form values", () => {
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					formValues = ref.current.getValues([FIELD_ONE_ID, FIELD_TWO_ID]);
				};
				render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClick} />);

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });
				fireEvent.change(getFieldTwo(), { target: { value: "world" } });
				fireEvent.click(getCustomButton());

				expect(formValues).toEqual(["hello", "world"]);
			});

			it("should include form values of unregistered fields if stripUnknown is not true", async () => {
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
					formValues = ref.current.getValues(["nonExistentField", "nonExistentField2"]);
				};
				render(
					<FrontendEngineWithCustomButton
						data={{ ...JSON_SCHEMA, defaultValues: { nonExistentField: "hello world" } }}
						onClick={handleClick}
					/>
				);
				await waitFor(() => fireEvent.click(getCustomButton()));

				expect(formValues).toEqual(["hello world", "john doe"]);
			});

			it("should exclude form values of unregistered fields if stripUnknown is true", async () => {
				const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
					ref.current.setValue("nonExistentField2", "john doe");
					formValues = ref.current.getValues(["nonExistentField", "nonExistentField2"]);
				};
				render(
					<FrontendEngineWithCustomButton
						data={{
							...JSON_SCHEMA,
							stripUnknown: true,
							defaultValues: { nonExistentField: "hello world" },
						}}
						onClick={handleClick}
					/>
				);
				await waitFor(() => fireEvent.click(getCustomButton()));

				expect(formValues).toEqual([]);
			});
		});
	});

	it("should update field value through setValue method", async () => {
		const onSubmit = jest.fn();
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			ref.current.setValue(FIELD_ONE_ID, "hello");
		};
		render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} onSubmit={onSubmit} />);

		fireEvent.click(getCustomButton());
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(onSubmit).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hello" }));
	});

	it("should return form validity through checkValid method", async () => {
		let isValid = false;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			isValid = ref.current.isValid();
		};
		render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);

		fireEvent.click(getCustomButton());
		expect(isValid).toBe(false);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.click(getCustomButton());
		expect(isValid).toBe(true);
	});

	describe("validate()", () => {
		it("should trigger form validation through validate method", async () => {
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.validate();
			};
			render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClick} />);
			fireEvent.click(getCustomButton());

			expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(await screen.findByText(ERROR_MESSAGE_2)).toBeInTheDocument();
		});

		it("should trigger field validation through validate method", async () => {
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.validate(FIELD_ONE_ID);
			};
			render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClick} />);
			fireEvent.click(getCustomButton());

			expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(screen.queryByText(ERROR_MESSAGE_2)).not.toBeInTheDocument();
		});

		it("should trigger multiple field validations through validate method", async () => {
			const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.validate([FIELD_ONE_ID, FIELD_TWO_ID]);
			};
			render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClick} />);
			fireEvent.click(getCustomButton());

			expect(await screen.findByText(ERROR_MESSAGE)).toBeInTheDocument();
			expect(await screen.findByText(ERROR_MESSAGE_2)).toBeInTheDocument();
		});
	});

	it("should return form isDirty state accordingly", async () => {
		let isDirty = false;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			isDirty = ref.current.isValid();
		};
		render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);

		fireEvent.click(getCustomButton());
		expect(isDirty).toBe(false);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.click(getCustomButton());
		expect(isDirty).toBe(true);
	});

	describe("custom validation", () => {
		interface IYupCustomValidationRule extends IYupValidationRule {
			myCustomRule?: boolean | undefined;
		}

		const TestComponent = (props: {
			fieldSchema?: Record<string, ITextFieldSchema<IYupCustomValidationRule>> | undefined;
			onClick: (ref: IFrontendEngineRef) => void;
		}) => {
			const {
				fieldSchema = {
					[FIELD_ONE_ID]: {
						label: FIELD_ONE_LABEL,
						uiType: UI_TYPE,
						validation: [{ myCustomRule: true, errorMessage: ERROR_MESSAGE }],
					},
				},
				onClick,
			} = props;
			const formRef = useRef<IFrontendEngineRef>();

			return (
				<>
					<FrontendEngine
						ref={formRef}
						data={{
							sections: {
								section: {
									uiType: "section",
									children: {
										...fieldSchema,
										...SUBMIT_BUTTON_SCHEMA,
									},
								},
							},
						}}
					/>
					<button onClick={() => onClick(formRef.current)}>Apply</button>
				</>
			);
		};

		it.each`
			type         | uiType                | fieldSchema        | invalid                 | valid
			${"string"}  | ${"text-field"}       | ${{}}              | ${"hi"}                 | ${"hello"}
			${"number"}  | ${"numeric-field"}    | ${{}}              | ${0}                    | ${1}
			${"boolean"} | ${"switch"}           | ${{}}              | ${false}                | ${true}
			${"array"}   | ${"multi-select"}     | ${{ options: [] }} | ${["a", "c"]}           | ${["a", "b"]}
			${"object"}  | ${"date-range-field"} | ${{}}              | ${{ from: "", to: "" }} | ${{ from: "2024-01-01", to: "2024-01-02" }}
		`(
			"should support custom validation for $type-based fields",
			async ({ type, uiType, fieldSchema, invalid, valid }) => {
				let counter = 0;
				const handleClick = (ref: IFrontendEngineRef) => {
					switch (counter) {
						case 0:
							ref.addCustomValidation(type, "myCustomRule", (value) => isEqual(value, valid));
							break;
						case 1:
							ref.setValue(FIELD_ONE_ID, invalid);
							break;
						case 2:
							ref.setValue(FIELD_ONE_ID, valid);
							break;
					}
					counter++;
				};
				render(
					<TestComponent
						fieldSchema={{
							[FIELD_ONE_ID]: {
								label: FIELD_ONE_LABEL,
								uiType,
								...fieldSchema,
								validation: [{ myCustomRule: true, errorMessage: ERROR_MESSAGE }],
							},
						}}
						onClick={handleClick}
					/>
				);

				fireEvent.click(getField("button", "Apply"));

				fireEvent.click(getField("button", "Apply"));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(getErrorMessage()).toBeInTheDocument();

				fireEvent.click(getField("button", "Apply"));
				await waitFor(() => fireEvent.click(getSubmitButton()));
				expect(getErrorMessage(true)).not.toBeInTheDocument();
			}
		);

		it("should support different custom validation of the same name in different instances", async () => {
			const handleClick1 = (ref: IFrontendEngineRef) => {
				ref.addCustomValidation("string", "myCustomRule", (value) => value === "hello");
			};
			const handleClick2 = (ref: IFrontendEngineRef) => {
				ref.addCustomValidation("string", "myCustomRule", (value) => value === "world");
			};

			render(
				<>
					<TestComponent onClick={handleClick1} />
					<TestComponent
						fieldSchema={{
							[FIELD_TWO_ID]: {
								label: FIELD_TWO_LABEL,
								uiType: UI_TYPE,
								validation: [{ myCustomRule: true, errorMessage: ERROR_MESSAGE }],
							},
						}}
						onClick={handleClick2}
					/>
				</>
			);

			const applyButtons = screen.getAllByRole("button", { name: "Apply" });
			const submitButtons = screen.getAllByRole("button", { name: "Submit" });

			applyButtons.forEach((button) => fireEvent.click(button));

			fireEvent.change(getFieldOne(), { target: { value: "hi" } });
			fireEvent.change(getFieldTwo(), { target: { value: "hi" } });
			await waitFor(() => fireEvent.click(submitButtons[0]));
			await waitFor(() => fireEvent.click(submitButtons[1]));

			expect(screen.getAllByText(ERROR_MESSAGE).length).toBe(2);

			fireEvent.change(getFieldOne(), { target: { value: "hello" } });
			fireEvent.change(getFieldTwo(), { target: { value: "world" } });
			await waitFor(() => fireEvent.click(submitButtons[0]));
			await waitFor(() => fireEvent.click(submitButtons[1]));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it("should not allow adding custom validation of the same name if overwrite is not true", async () => {
			const handleClick = (ref: IFrontendEngineRef) => {
				ref.addCustomValidation("string", "myCustomRule", (value) => value === "hello");
				ref.addCustomValidation("string", "myCustomRule", (value) => value === "hi");
			};

			render(<TestComponent onClick={handleClick} />);
			fireEvent.click(getField("button", "Apply"));

			fireEvent.change(getFieldOne(), { target: { value: "hi" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();

			fireEvent.change(getFieldOne(), { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it("should allow adding custom validation of the same name if overwrite is true", async () => {
			const handleClick = (ref: IFrontendEngineRef) => {
				ref.addCustomValidation("string", "myCustomRule", (value) => value === "hello", true);
				ref.addCustomValidation("string", "myCustomRule", (value) => value === "hi", true);
			};

			render(<TestComponent onClick={handleClick} />);
			fireEvent.click(getField("button", "Apply"));

			fireEvent.change(getFieldOne(), { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();

			fireEvent.change(getFieldOne(), { target: { value: "hi" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});
	});

	it("should silently skip rendering schema with referenceKey", () => {
		const frontendEngine = renderComponent(undefined, {
			sections: {
				section: {
					uiType: "section",
					children: {
						custom: {
							referenceKey: "something" as any,
							label: "Something",
						},
					},
				},
			},
		});

		expect(screen.queryByText(ERROR_MESSAGES.GENERIC.UNSUPPORTED)).not.toBeInTheDocument();
		expect(frontendEngine.container.querySelector("section")).not.toBeInTheDocument();
	});

	it("should clear validation rules of removed fields when schema is updated", async () => {
		const submitFn = jest.fn();
		const CustomFrontendEngine = () => {
			const [schema, setSchema] = useState<IFrontendEngineData>(JSON_SCHEMA);
			const handleClick = () =>
				setSchema((state) => ({
					...state,
					sections: {
						section: {
							uiType: "section",
							children: {
								[FIELD_TWO_ID]: {
									uiType: "text-field",
									label: "New text field",
								},
								...getSubmitButtonProps(),
							},
						},
					},
				}));

			return (
				<>
					<FrontendEngine data={schema} onSubmit={submitFn} />
					<Button.Default onClick={handleClick}>Update schema</Button.Default>
				</>
			);
		};

		render(<CustomFrontendEngine />);
		fireEvent.click(screen.getByRole("button", { name: "Update schema" }));
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(submitFn).toBeCalled();
	});

	describe("setErrors", () => {
		const handleClickDefault = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			ref.current.setErrors({ [FIELD_ONE_ID]: ERROR_MESSAGE });
		};
		const handleClickArray = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			ref.current.setErrors({ [FIELD_ONE_ID]: [ERROR_MESSAGE] });
		};

		it("should support setting of custom errors", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClickDefault} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getFieldOne().parentElement.nextSibling.textContent).toMatch(ERROR_MESSAGE);
		});

		it("should convert error object to string", async () => {
			const handleClickNested = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.setErrors({
					[FIELD_ONE_ID]: {
						something: "else",
					},
				});
			};
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClickNested} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getFieldOne().parentElement.nextSibling.textContent).toMatch(
				JSON.stringify({
					something: "else",
				})
			);
		});

		it("should clear the error message related to API when the user edits the field", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClickDefault} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			fireEvent.change(getFieldOne(), { target: { value: "hello" } });

			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		describe("errorMessage type", () => {
			it.each`
				type        | onClick
				${"string"} | ${handleClickDefault}
				${"array"}  | ${handleClickArray}
			`("should suppport error message of $type type", async ({ type, onClick }) => {
				switch (type) {
					case "string":
						render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={onClick} />);
						break;
					case "array":
						render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={onClick} />);
						break;
				}
				await waitFor(() => fireEvent.click(getCustomButton()));

				fireEvent.change(getFieldOne(), { target: { value: "hello" } });

				expect(getErrorMessage(true)).not.toBeInTheDocument();
			});
		});
	});

	describe("clearErrors", () => {
		it("should support clear all the errors", async () => {
			const handleClickDefault = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.clearErrors();
			};
			render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClickDefault} />);
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();
			expect(getErrorMessage(false, ERROR_MESSAGE_2)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
			expect(getErrorMessage(true, ERROR_MESSAGE_2)).not.toBeInTheDocument();
		});

		it("should support clear individual error", async () => {
			const handleClickDefault = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.clearErrors(FIELD_ONE_ID);
			};
			render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClickDefault} />);
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();
			expect(getErrorMessage(false, ERROR_MESSAGE_2)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
			expect(getErrorMessage(true, ERROR_MESSAGE_2)).toBeInTheDocument();
		});

		it("should support clear multiple errors", async () => {
			const handleClickDefault = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				ref.current.clearErrors([FIELD_ONE_ID, FIELD_TWO_ID]);
			};
			render(<FrontendEngineWithCustomButton data={MULTI_FIELD_SCHEMA} onClick={handleClickDefault} />);
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();
			expect(getErrorMessage(false, ERROR_MESSAGE_2)).toBeInTheDocument();

			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getErrorMessage(true)).not.toBeInTheDocument();
			expect(getErrorMessage(true, ERROR_MESSAGE_2)).not.toBeInTheDocument();
		});
	});

	describe("setWarnings", () => {
		it("should support setting of warnings", async () => {
			const handleSetWarnings = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				try {
					throw new Error("API error");
				} catch (error) {
					ref.current.setWarnings({
						[FIELD_ONE_ID]: ERROR_MESSAGE,
					});
				}
			};

			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleSetWarnings} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(screen.getByTestId(`${FIELD_ONE_ID}__warning`)).toHaveTextContent(ERROR_MESSAGE);
		});

		it("should support setting of warnings for nested fields", async () => {
			const handleSetWarnings = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
				try {
					throw new Error("API error");
				} catch (error) {
					ref.current.setWarnings({
						[FIELD_TWO_ID]: ERROR_MESSAGE,
					});
				}
			};

			render(<FrontendEngineWithCustomButton data={NESTED_JSON_SCHEMA} onClick={handleSetWarnings} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(screen.getByTestId(`${FIELD_TWO_ID}__warning`)).toHaveTextContent(ERROR_MESSAGE);
		});
	});

	describe("validationMode", () => {
		it("should support validate on touched by default", async () => {
			renderComponent();

			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.change(getFieldOne(), { target: { value: "h" } }));
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(getFieldOne()));
			expect(getErrorMessage()).toBeInTheDocument();

			await waitFor(() => fireEvent.change(getFieldOne(), { target: { value: "he" } }));
			expect(getErrorMessage(true)).not.toBeInTheDocument();
		});

		it("should support onBlur validationMode", async () => {
			renderComponent(undefined, { validationMode: "onBlur" });

			fireEvent.change(getFieldOne(), { target: { value: "h" } });
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(getFieldOne()));
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should support onChange validationMode", async () => {
			renderComponent(undefined, { validationMode: "onChange" });

			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.change(getFieldOne(), { target: { value: "h" } }));
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should support onSubmit validationMode", async () => {
			renderComponent();

			fireEvent.change(getFieldOne(), { target: { value: "h" } });
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			fireEvent.blur(getFieldOne());
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should support all validationMode", async () => {
			renderComponent(undefined, { validationMode: "all" });

			await waitFor(() => fireEvent.blur(getFieldOne()));
			expect(getErrorMessage()).toBeInTheDocument();

			await waitFor(() => fireEvent.change(getFieldOne(), { target: { value: "h" } }));
			expect(getErrorMessage(true)).toBeInTheDocument();
		});
	});

	describe("revalidationMode", () => {
		it("should revalidate on change by default", async () => {
			renderComponent();

			fireEvent.change(getFieldOne(), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.change(getFieldOne(), { target: { value: "h" } }));
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should support onBlur revalidationMode", async () => {
			renderComponent(undefined, { revalidationMode: "onBlur" });

			fireEvent.change(getFieldOne(), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			fireEvent.change(getFieldOne(), { target: { value: "h" } });
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(getFieldOne()));
			expect(getErrorMessage()).toBeInTheDocument();
		});

		it("should support onSubmit revalidationMode", async () => {
			renderComponent(undefined, { revalidationMode: "onSubmit" });

			fireEvent.change(getFieldOne(), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			fireEvent.change(getFieldOne(), { target: { value: "h" } });
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();
		});
	});

	it("should allow adding, dispatching and removing of field event listener", () => {
		const testFn = jest.fn();
		const eventName = "my-event";

		const FrontendEngineWithEvent = () => {
			const ref = useRef<IFrontendEngineRef>();
			const handleAddFieldEventListener = () => {
				ref.current?.addFieldEventListener(eventName, FIELD_ONE_ID, testFn);
			};
			const handleDispatchFieldEventListener = () => {
				ref.current?.dispatchFieldEvent(eventName, FIELD_ONE_ID);
			};
			const handleRemoveFieldEventListener = () => {
				ref.current?.removeFieldEventListener(eventName, FIELD_ONE_ID, testFn);
			};

			return (
				<>
					<FrontendEngine ref={ref} data={JSON_SCHEMA} />
					<Button.Default onClick={handleAddFieldEventListener}>Add field event listener</Button.Default>
					<Button.Default onClick={handleDispatchFieldEventListener}>
						Dispatch field event listener
					</Button.Default>
					<Button.Default onClick={handleRemoveFieldEventListener}>
						Remove field event listener
					</Button.Default>
				</>
			);
		};
		render(<FrontendEngineWithEvent />);

		fireEvent.click(screen.getByRole("button", { name: "Dispatch field event listener" }));
		expect(testFn).not.toBeCalled();

		fireEvent.click(screen.getByRole("button", { name: "Add field event listener" }));
		fireEvent.click(screen.getByRole("button", { name: "Dispatch field event listener" }));
		expect(testFn).toBeCalledTimes(1);

		fireEvent.click(screen.getByRole("button", { name: "Remove field event listener" }));
		fireEvent.click(screen.getByRole("button", { name: "Dispatch field event listener" }));
		expect(testFn).toBeCalledTimes(1);
	});

	describe("overrides", () => {
		it("should support overriding of schema on mount", () => {
			renderComponent(undefined, {
				overrides: {
					[FIELD_ONE_ID]: {
						disabled: true,
					},
				},
			});

			expect(getFieldOne()).toBeDisabled();
		});

		it("should remove entries on overriding with null values", () => {
			render(
				<FrontendEngine
					data={{
						sections: {
							section1: {
								uiType: "section",
								children: {
									[FIELD_ONE_ID]: {
										uiType: "chips",
										label: FIELD_ONE_LABEL,
										disabled: true,
										options: [
											{ label: "A", value: "Apple" },
											{ label: "B", value: "Berry" },
										],
									},
								},
							},
							section2: {
								uiType: "section",
								children: {
									[FIELD_TWO_ID]: {
										uiType: "text-field",
										label: FIELD_TWO_LABEL,
									},
								},
							},
						},
						overrides: {
							[FIELD_ONE_ID]: {
								disabled: null,
								options: [null],
							},
							section2: null,
						},
					}}
				/>
			);

			expect(getField("button", "A", true)).not.toBeInTheDocument();
			expect(getField("button", "B")).toBeInTheDocument();
			expect(getField("button", "B")).toBeEnabled();
			expect(getField("textbox", FIELD_TWO_LABEL, true)).not.toBeInTheDocument();
		});

		it("should not change or remove entries on overriding with undefined values", () => {
			renderComponent(undefined, {
				sections: {
					section: {
						uiType: "section",
						children: {
							[FIELD_ONE_ID]: {
								uiType: "chips",
								label: FIELD_ONE_LABEL,
								options: [
									{ label: "A", value: "Apple" },
									{ label: "B", value: "Berry" },
								],
							},
						},
					},
				},
				overrides: {
					[FIELD_ONE_ID]: {
						label: undefined,
						options: [undefined],
					},
				},
			});

			expect(screen.getByText(FIELD_ONE_LABEL)).toBeInTheDocument();
			expect(getField("button", "A")).toBeInTheDocument();
		});

		it("should allow overriding of schema after mount", () => {
			const FrontendEngineWithOverrides = () => {
				const [schema, setSchema] = useState<IFrontendEngineData>(JSON_SCHEMA);
				const handleClick = () =>
					setSchema((state) => ({
						...state,
						overrides: {
							[FIELD_ONE_ID]: { disabled: true },
						},
					}));

				return (
					<>
						<FrontendEngine data={schema} />
						<Button.Default onClick={handleClick}>Override schema</Button.Default>
					</>
				);
			};
			render(<FrontendEngineWithOverrides />);

			expect(getFieldOne()).not.toBeDisabled();

			fireEvent.click(screen.getByRole("button", { name: "Override schema" }));

			expect(getField("textbox", FIELD_ONE_LABEL)).toBeDisabled();
		});

		it("should allow overriding of validation config", async () => {
			const onSubmit = jest.fn();
			renderComponent(
				{ onSubmit },
				{
					overrides: {
						[FIELD_ONE_ID]: {
							validation: [undefined, { min: 3, errorMessage: ERROR_MESSAGE }],
						},
					},
				}
			);
			fireEvent.change(getFieldOne(), { target: { value: "hi" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(onSubmit).not.toBeCalled();
			expect(getFieldOne().parentElement.nextSibling.textContent).toMatch(ERROR_MESSAGE);
		});

		it("should retain defaultValues after overriding", () => {
			renderComponent(undefined, {
				overrides: {
					[FIELD_ONE_ID]: {
						disabled: true,
					},
				},
				defaultValues: {
					[FIELD_ONE_ID]: "hello world",
				},
			});

			expect(getField("textbox", FIELD_ONE_LABEL)).toBeDisabled();
			expect(getField("textbox", FIELD_ONE_LABEL)).toHaveValue("hello world");
		});
	});
});
