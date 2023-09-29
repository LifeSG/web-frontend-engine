import { Button } from "@lifesg/react-design-system/button";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import cloneDeep from "lodash/cloneDeep";
import merge from "lodash/merge";
import { useEffect, useRef, useState } from "react";
import { FrontendEngine } from "../../../components";
import { IYupValidationRule } from "../../../components/frontend-engine/yup";
import { ERROR_MESSAGES } from "../../../components/shared";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/types";
import { TestHelper } from "../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	FrontendEngineWithCustomButton,
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
	beforeEach(() => {
		jest.resetAllMocks();
	});

	it("should render a form with JSON provided", () => {
		renderComponent();

		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
		expect(getFieldOne()).toBeInTheDocument();
	});

	describe("onChange", () => {
		const onChange = jest.fn();
		it("should call onChange prop", async () => {
			renderComponent({
				onChange,
			});

			fireEvent.change(getFieldOne(), { target: { value: "hello" } });
			await waitFor(() => fireEvent.click(getSubmitButton()));

			expect(onChange).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "hello" }), true);
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

			expect(onChange).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "a" }), true);
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

			expect(onChange).toBeCalledWith(expect.objectContaining({ [FIELD_ONE_ID]: "a" }), false);
		});

		it("should include form values of unregistered fields if stripUnknown is not true", () => {
			renderComponent({ onChange }, { ...JSON_SCHEMA, defaultValues: { nonExistentField: "hello world" } });
			fireEvent.change(getFieldOne(), { target: { value: "hello" } });

			const finalOnChangeCall = onChange.mock.lastCall[0];
			expect(finalOnChangeCall).toEqual({
				[FIELD_ONE_ID]: "hello",
				nonExistentField: "hello world",
				submit: undefined,
			});
		});

		it("should exclude form values of unregistered fields if stripUnknown is true", () => {
			renderComponent(
				{ onChange },
				{ ...JSON_SCHEMA, stripUnknown: true, defaultValues: { nonExistentField: "hello world" } }
			);
			fireEvent.change(getFieldOne(), { target: { value: "hello" } });

			const finalOnChangeCall = onChange.mock.lastCall[0];
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

	describe("getValues()", () => {
		const MULTI_FIELD_SCHEMA = merge(cloneDeep(JSON_SCHEMA), {
			sections: {
				section: {
					children: {
						[FIELD_TWO_ID]: {
							label: FIELD_TWO_LABEL,
							uiType: UI_TYPE,
							validation: [{ required: true }],
						},
					},
				},
			},
		});

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

	describe("submit", () => {
		it("should submit through submit method", async () => {
			const submitFn = jest.fn();
			render(<FrontendEngine data={JSON_SCHEMA} onSubmit={submitFn} />);

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
					data={{ ...JSON_SCHEMA, stripUnknown: true, defaultValues: { nonExistentField: "hello world" } }}
					onClick={handleClick}
					onSubmit={submitFn}
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

		render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClick} />);
		const field = getFieldOne();
		fireEvent.change(field, { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getCustomButton()));

		expect(field).toHaveValue("");
	});

	it("should support custom validation", async () => {
		interface IYupCustomValidationRule extends IYupValidationRule {
			mustBeHello?: boolean | undefined;
		}

		const FrontendEngineWithCustomRule = () => {
			const ref = useRef<IFrontendEngineRef>();
			useEffect(() => {
				ref.current?.addCustomValidation("string", "mustBeHello", (value) => value === "hello");
			}, [ref]);

			return (
				<FrontendEngine<IYupCustomValidationRule>
					ref={ref}
					data={{
						...JSON_SCHEMA,
						sections: {
							section: {
								uiType: "section",
								children: {
									...JSON_SCHEMA.sections.section.children,
									[FIELD_ONE_ID]: {
										label: FIELD_ONE_LABEL,
										uiType: UI_TYPE,
										validation: [{ mustBeHello: true, errorMessage: ERROR_MESSAGE }],
									},
								},
							},
						},
					}}
				/>
			);
		};
		render(<FrontendEngineWithCustomRule />);

		fireEvent.change(getFieldOne(), { target: { value: "hi" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(getErrorMessage()).toBeInTheDocument();

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));
		expect(getErrorMessage(true)).not.toBeInTheDocument();
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

	describe("setErrors", () => {
		const handleClickDefault = async (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			try {
				throw new Error("API error");
			} catch (error) {
				ref.current.setErrors({
					[FIELD_ONE_ID]: ERROR_MESSAGE,
				});
			}
		};

		const handleClickArray = async (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			try {
				throw new Error("API error");
			} catch (error) {
				ref.current.setErrors({
					[FIELD_ONE_ID]: [ERROR_MESSAGE],
				});
			}
		};

		const handleClickNested = async (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			try {
				throw new Error("API error");
			} catch (error) {
				ref.current.setErrors({
					[FIELD_ONE_ID]: {
						[FIELD_TWO_ID]: ERROR_MESSAGE,
					},
				});
			}
		};

		it("should support setting of custom errors", async () => {
			render(<FrontendEngineWithCustomButton data={JSON_SCHEMA} onClick={handleClickDefault} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getFieldOne().parentElement.nextSibling.textContent).toMatch(ERROR_MESSAGE);
		});

		it("should support setting of custom errors for nested fields", async () => {
			render(<FrontendEngineWithCustomButton data={NESTED_JSON_SCHEMA} onClick={handleClickNested} />);
			await waitFor(() => fireEvent.click(getCustomButton()));

			expect(getFieldTwo().parentElement.nextSibling.textContent).toMatch(ERROR_MESSAGE);
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
