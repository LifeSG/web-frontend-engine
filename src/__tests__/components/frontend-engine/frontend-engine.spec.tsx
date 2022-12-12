import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { FrontendEngine } from "../../../components";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/types";
import { TestHelper } from "../../../utils";
import { ERROR_MESSAGE, FRONTEND_ENGINE_ID, SUBMIT_BUTTON_ID } from "../../common";

const fieldType = "text";
const fieldOneId = "field1";
const fieldOneTestId = TestHelper.generateId(fieldOneId, fieldType);
const componentTestId = TestHelper.generateId(FRONTEND_ENGINE_ID, "frontend-engine");
const buttonTestId = "button";

const JSON_SCHEMA: IFrontendEngineData = {
	id: FRONTEND_ENGINE_ID,
	fields: {
		[fieldOneId]: {
			label: "Field 1",
			fieldType,
			validation: [
				{ required: true, errorMessage: ERROR_MESSAGE },
				{ min: 2, errorMessage: ERROR_MESSAGE },
			],
		},
		submit: {
			label: "Submit",
			fieldType: "submit",
		},
	},
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
			<button type="button" data-testid={buttonTestId} onClick={() => onClick(ref)} />
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

		expect(screen.queryByTestId(componentTestId)).toBeInTheDocument();
		expect(screen.queryByTestId(fieldOneTestId)).toBeInTheDocument();
	});

	it("should call onChange prop on change", async () => {
		const onChange = jest.fn();
		renderComponent({
			onChange,
		});

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(onChange).toBeCalledWith(expect.objectContaining({ [fieldOneId]: "hello" }), true);
	});

	it("should call onSubmit prop on submit", async () => {
		const onSubmit = jest.fn();
		renderComponent({
			onSubmit,
		});

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

		expect(onSubmit).toBeCalled();
	});

	it("should return form values through getValues method", () => {
		let formValues: Record<string, any> = {};
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formValues = ref.current.getValues();
		};
		render(<FrontendEngineWithCustomButton onClick={handleClick} />);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		fireEvent.click(screen.getByTestId(buttonTestId));

		expect(formValues?.[fieldOneId]).toBe("hello");
	});

	it("should return form validity through checkValid method", async () => {
		let isValid = false;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			isValid = ref.current.isValid();
		};
		render(<FrontendEngineWithCustomButton onClick={handleClick} />);

		fireEvent.click(screen.getByTestId(buttonTestId));
		expect(isValid).toBe(false);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		fireEvent.click(screen.getByTestId(buttonTestId));
		expect(isValid).toBe(true);
	});

	it("should submit through submit method", async () => {
		const submitFn = jest.fn();
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => ref.current.submit();
		render(<FrontendEngineWithCustomButton onSubmit={submitFn} onClick={handleClick} />);

		fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(screen.getByTestId(buttonTestId)));

		expect(submitFn).toBeCalled();
	});

	describe("validationMode", () => {
		it("should validate on submit by default", async () => {
			renderComponent();

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onBlur validationMode", async () => {
			renderComponent(undefined, { validationMode: "onBlur" });

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(screen.getByTestId(fieldOneTestId)));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onChange validationMode", async () => {
			renderComponent(undefined, { validationMode: "onChange" });

			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "h" } }));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});

	describe("revalidationMode", () => {
		it("should revalidate on change by default", async () => {
			renderComponent();

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "h" } }));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onBlur revalidationMode", async () => {
			renderComponent(undefined, { revalidationMode: "onBlur" });

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(screen.getByTestId(fieldOneTestId)));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onSubmit revalidationMode", async () => {
			renderComponent(undefined, { revalidationMode: "onSubmit" });

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(screen.getByTestId(SUBMIT_BUTTON_ID)));

			fireEvent.change(screen.getByTestId(fieldOneTestId), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.submit(screen.getByTestId(SUBMIT_BUTTON_ID)));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});
});
