import { Form } from "@lifesg/react-design-system/form";
import "@testing-library/react/dont-cleanup-after-each"; // must import this before @testing-library/react
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useRef } from "react";
import * as Yup from "yup";
import {
	FrontendEngine,
	IFrontendEngineData,
	IFrontendEngineRef,
	TCustomComponentProps,
	TCustomComponentSchema,
} from "../../../components";
import { IYupValidationRule, TCustomComponent } from "../../../context-providers";
import { useFrontendEngineComponent } from "../../../utils/hooks";
import { getSubmitButton, getSubmitButtonProps } from "../../common";

// =============================================================================
// MOCK CONSTS
// =============================================================================
const LABEL = "Custom component";
const REFERENCE_KEY = "my-custom-component";
const FIELD_ID = "myCustomComponent";
const CUSTOM_COMPONENT_ERROR_MESSAGE = "My custom component error";
const ERROR_MESSAGE = "error message";
const ERROR_MESSAGE_2 = "error message 2";
const SUBMIT_FN = jest.fn();
const TEST_EVENT = jest.fn();
const DISPATCH_EVENT = jest.fn();

// =============================================================================
// CUSTOM COMPONENT
// =============================================================================
interface MyCustomRule extends IYupValidationRule {
	mustBeHelloWorld?: boolean | undefined;
}
interface MyCustomSchema extends TCustomComponentSchema<"my-custom-component", MyCustomRule> {
	displayTitle: string;
}
const MyCustomComponent: TCustomComponent<MyCustomSchema> = (props: TCustomComponentProps<MyCustomSchema>) => {
	const {
		error,
		id,
		onChange,
		schema: { displayTitle, validation },
		value,
		...otherProps
	} = props;

	const {
		validation: { setValidation },
		event: { addFieldEventListener, dispatchFieldEvent, removeFieldEventListener },
	} = useFrontendEngineComponent();

	useEffect(() => {
		addFieldEventListener("test-event", id, TEST_EVENT);
	}, []);

	useEffect(() => {
		setValidation(
			id,
			Yup.string().test("custom-rule", CUSTOM_COMPONENT_ERROR_MESSAGE, (value) => {
				if (!value) return true;
				return value.startsWith("hello");
			}),
			validation
		);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [validation]);

	const handleDispatchEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
		onChange(e);
		dispatchFieldEvent("dispatch-event", id);
	};

	const handleRemoveEvent = () => {
		removeFieldEventListener("test-event", id, TEST_EVENT);
	};

	return (
		<Form.Input
			label={displayTitle}
			id={id}
			errorMessage={error?.message}
			onChange={handleDispatchEvent}
			onClick={handleRemoveEvent}
			value={value || ""}
			{...otherProps}
		/>
	);
};

// =============================================================================
// WRAPPED FRONTEND ENGINE
// =============================================================================
const WrappedFrontendEngine = () => {
	const formRef = useRef<IFrontendEngineRef>(null);

	useEffect(() => {
		formRef.current?.addCustomValidation("string", "mustBeHelloWorld", (value) => value === "hello world");
		formRef.current?.addFieldEventListener("dispatch-event", FIELD_ID, DISPATCH_EVENT);
	}, []);

	const handleClick = () => {
		formRef.current?.dispatchFieldEvent("test-event", FIELD_ID);
	};

	return (
		<>
			<FrontendEngine
				components={{ [REFERENCE_KEY]: MyCustomComponent }}
				data={JSON_SCHEMA}
				onSubmit={SUBMIT_FN}
				ref={formRef}
			/>
			<button onClick={handleClick}>Test added event</button>
		</>
	);
};

const JSON_SCHEMA: IFrontendEngineData<undefined, MyCustomSchema> = {
	sections: {
		section: {
			uiType: "section",
			children: {
				[FIELD_ID]: {
					referenceKey: REFERENCE_KEY,
					displayTitle: LABEL,
					validation: [
						{ required: true, errorMessage: ERROR_MESSAGE },
						{ mustBeHelloWorld: true, errorMessage: ERROR_MESSAGE_2 },
					],
				},
				...getSubmitButtonProps(),
			},
		},
	},
};

const getField = () => {
	return screen.getByLabelText(LABEL);
};

describe("custom components", () => {
	beforeAll(() => {
		render(<WrappedFrontendEngine />);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	afterAll(() => {
		cleanup();
	});

	it("should be able to render components defined through the components prop", () => {
		expect(getField()).toBeInTheDocument();
	});

	it("should be able to submit values", async () => {
		fireEvent.change(getField(), { target: { value: "hello world" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(SUBMIT_FN).toHaveBeenCalledWith({ [FIELD_ID]: "hello world", submit: undefined });
	});

	it("should be able to support validation", async () => {
		fireEvent.change(getField(), { target: { value: null } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText(ERROR_MESSAGE)).toBeInTheDocument();
		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should be able to support custom validation defined through addCustomValidation", async () => {
		fireEvent.change(getField(), { target: { value: "hello" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText(ERROR_MESSAGE_2)).toBeInTheDocument();
		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should be able to support custom validation defined in the component", async () => {
		fireEvent.change(getField(), { target: { value: "invalid" } });
		await waitFor(() => fireEvent.click(getSubmitButton()));

		expect(screen.getByText(CUSTOM_COMPONENT_ERROR_MESSAGE)).toBeInTheDocument();
		expect(SUBMIT_FN).not.toHaveBeenCalled();
	});

	it("should be able to add field event listener", async () => {
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "Test added event" })));

		expect(TEST_EVENT).toHaveBeenCalled();
	});

	it("should be able to dispatch field event listener", async () => {
		await waitFor(() => fireEvent.change(getField(), { target: { value: "hello" } }));

		expect(DISPATCH_EVENT).toHaveBeenCalled();
	});

	it("should be able to remove field event listener", async () => {
		fireEvent.click(getField());
		await waitFor(() => fireEvent.click(screen.getByRole("button", { name: "Test added event" })));

		expect(TEST_EVENT).not.toHaveBeenCalled();
	});
});
