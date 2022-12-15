import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useRef } from "react";
import { FrontendEngine } from "../../../components";
import { IFrontendEngineData, IFrontendEngineProps, IFrontendEngineRef } from "../../../components/types";
import { TestHelper } from "../../../utils";
import { ERROR_MESSAGE, FRONTEND_ENGINE_ID, getSubmitButton, SUBMIT_BUTTON_ID } from "../../common";

const fieldType = "text";
const fieldOneId = "field1";
const fieldOneLabel = "Field 1";
const customButtonId = "button";
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
		[SUBMIT_BUTTON_ID]: {
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
			<button type="button" aria-label={customButtonId} onClick={() => onClick(ref)} />
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
		expect(screen.getByRole("textbox", { name: fieldOneLabel })).toBeInTheDocument();
	});

	it("should call onChange prop on change", async () => {
		const onChange = jest.fn();
		renderComponent({
			onChange,
		});

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton(screen)));

		expect(onChange).toBeCalledWith(expect.objectContaining({ [fieldOneId]: "hello" }), true);
	});

	it("should call onSubmit prop on submit", async () => {
		const onSubmit = jest.fn();
		renderComponent({
			onSubmit,
		});

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton(screen)));

		expect(onSubmit).toBeCalled();
	});

	it("should return form values through getValues method", () => {
		let formValues: Record<string, any> = {};
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formValues = ref.current.getValues();
		};
		render(<FrontendEngineWithCustomButton onClick={handleClick} />);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		fireEvent.click(screen.getByRole("button", { name: customButtonId }));

		expect(formValues?.[fieldOneId]).toBe("hello");
	});

	it("should return form validity through checkValid method", async () => {
		let isValid = false;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			isValid = ref.current.isValid();
		};
		render(<FrontendEngineWithCustomButton onClick={handleClick} />);

		fireEvent.click(screen.getByRole("button", { name: customButtonId }));
		expect(isValid).toBe(false);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		fireEvent.click(screen.getByRole("button", { name: customButtonId }));
		expect(isValid).toBe(true);
	});

	it("should submit through submit method", async () => {
		const submitFn = jest.fn();
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => ref.current.submit();
		render(<FrontendEngineWithCustomButton onSubmit={submitFn} onClick={handleClick} />);

		fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: customButtonId })));

		expect(submitFn).toBeCalled();
	});

	describe("validationMode", () => {
		it("should validate on submit by default", async () => {
			renderComponent();

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton(screen)));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onBlur validationMode", async () => {
			renderComponent(undefined, { validationMode: "onBlur" });

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(screen.getByRole("textbox", { name: fieldOneLabel })));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onChange validationMode", async () => {
			renderComponent(undefined, { validationMode: "onChange" });

			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() =>
				fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "h" } })
			);
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});

	describe("revalidationMode", () => {
		it("should revalidate on change by default", async () => {
			renderComponent();

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(getSubmitButton(screen)));
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() =>
				fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "h" } })
			);
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onBlur revalidationMode", async () => {
			renderComponent(undefined, { revalidationMode: "onBlur" });

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(getSubmitButton(screen)));

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.blur(screen.getByRole("textbox", { name: fieldOneLabel })));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});

		it("should support onSubmit revalidationMode", async () => {
			renderComponent(undefined, { revalidationMode: "onSubmit" });

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "he" } });
			await waitFor(() => fireEvent.click(getSubmitButton(screen)));

			fireEvent.change(screen.getByRole("textbox", { name: fieldOneLabel }), { target: { value: "h" } });
			expect(screen.queryByText(ERROR_MESSAGE)).not.toBeInTheDocument();

			await waitFor(() => fireEvent.click(getSubmitButton(screen)));
			expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		});
	});
});
