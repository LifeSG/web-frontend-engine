import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { FrontendEngine } from "../../../components";
import { IYupValidationRule } from "../../../components/frontend-engine/yup";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/types";
import { TestHelper } from "../../../utils";
import {
	ERROR_MESSAGE,
	FRONTEND_ENGINE_ID,
	getErrorMessage,
	getField,
	getSubmitButton,
	getSubmitButtonProps,
} from "../../common";

const fieldType = "text";
const fieldOneId = "field1";
const fieldOneLabel = "Field 1";
const customButtonLabel = "custom button";
const componentTestId = TestHelper.generateId(FRONTEND_ENGINE_ID, "frontend-engine");

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	fields: {
		[fieldOneId]: {
			label: fieldOneLabel,
			fieldType,
			validation: [
				{ required: true, errorMessage: ERROR_MESSAGE },
				{ min: 2, errorMessage: ERROR_MESSAGE },
			],
		},
		...getSubmitButtonProps(),
	},
};

const getFieldOne = (): HTMLElement => {
	return getField("textbox", fieldOneLabel);
};

const getCustomSubmitButton = (): HTMLElement => {
	return screen.getByRole("button", { name: customButtonLabel });
};

const FrontendEngineWithCustomButton = (props: {
	onSubmit?: () => void;
	onClick: (ref: React.MutableRefObject<IFrontendEngineRef>) => void;
}) => {
	const { onSubmit, onClick } = props;
	const ref = useRef<IFrontendEngineRef>();

	return (
		<>
			<FrontendEngine data={JSON_SCHEMA} ref={ref} onSubmit={onSubmit} />
			<button type="button" onClick={() => onClick(ref)}>
				{customButtonLabel}
			</button>
		</>
	);
};

const renderComponent = (
	overrideProps?: Partial<IFrontendEngineProps>,
	overrideData?: Partial<IFrontendEngineData>
) => {
	const json: IFrontendEngineData = {
		...JSON_SCHEMA,
		...overrideData,
		fields: {
			...JSON_SCHEMA.fields,
			...overrideData?.fields,
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

		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
		expect(getFieldOne()).toBeInTheDocument();
	});

	it("should call onChange prop on change", async () => {
		const onChange = jest.fn();
		renderComponent({
			onChange,
		});

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(onChange).toBeCalledWith(expect.objectContaining({ [fieldOneId]: "hello" }), true);
	});

	it("should call onSubmit prop on submit", async () => {
		const onSubmit = jest.fn();
		renderComponent({
			onSubmit,
		});

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(onSubmit).toBeCalled();
	});

	it("should return form values through getValues method", () => {
		let formValues: Record<string, any> = {};
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formValues = ref.current.getValues();
		};
		render(<FrontendEngineWithCustomButton onClick={handleClick} />);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.click(getCustomSubmitButton());

		expect(formValues?.[fieldOneId]).toBe("hello");
	});

	it("should return form validity through checkValid method", async () => {
		let isValid = false;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			isValid = ref.current.isValid();
		};
		render(<FrontendEngineWithCustomButton onClick={handleClick} />);

		fireEvent.click(getCustomSubmitButton());
		expect(isValid).toBe(false);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		fireEvent.click(getCustomSubmitButton());
		expect(isValid).toBe(true);
	});

	it("should submit through submit method", async () => {
		const submitFn = jest.fn();
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => ref.current.submit();
		render(<FrontendEngineWithCustomButton onSubmit={submitFn} onClick={handleClick} />);

		fireEvent.change(getFieldOne(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getCustomSubmitButton()));

		expect(submitFn).toBeCalled();
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
						fields: {
							...JSON_SCHEMA.fields,
							[fieldOneId]: {
								label: fieldOneLabel,
								fieldType,
								validation: [{ mustBeHello: true, errorMessage: ERROR_MESSAGE }],
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

	describe("validationMode", () => {
		it("should validate on submit by default", async () => {
			renderComponent();

			fireEvent.change(getFieldOne(), { target: { value: "h" } });
			expect(getErrorMessage(true)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton()));
			expect(getErrorMessage()).toBeInTheDocument();
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
});
