import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useEffect, useRef } from "react";
import { TReviewSchema } from "../../../../components/custom";
import {
	FrontendEngine,
	IFrontendEngineData,
	IFrontendEngineProps,
	IFrontendEngineRef,
} from "../../../../components/frontend-engine";
import { AxiosApiClient } from "../../../../utils";
import { FRONTEND_ENGINE_ID, getField } from "../../../common";

const COMPONENT_ID = "field";
const REFERENCE_KEY = "review";
const LABEL = "label";
const DESCRIPTION = "description";
const ITEMS = [
	{ label: "Label 1", value: "Value 1" },
	{ label: "Label 2", value: "Value 2" },
];
const ALERT_TOP = "test top alert";
const ALERT_BOTTOM = "test bottom alert";

interface ICustomFrontendEngineProps extends IFrontendEngineProps {
	eventType?: string | undefined;
	eventListener?: ((this: Element, ev: Event) => any) | undefined;
}

const FrontendEngineWithEventListener = (props: ICustomFrontendEngineProps) => {
	const { eventType, eventListener, ...otherProps } = props;
	const formRef = useRef<IFrontendEngineRef>();

	useEffect(() => {
		if (eventType && eventListener) {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(REFERENCE_KEY, eventType as any, COMPONENT_ID, eventListener);
			return () =>
				currentFormRef.removeFieldEventListener(REFERENCE_KEY, eventType as any, COMPONENT_ID, eventListener);
		}
	}, [eventListener, eventType]);

	return <FrontendEngine {...otherProps} ref={formRef} />;
};

interface IRenderAndPerformActionsOptions {
	overrideField?: Partial<TReviewSchema> | undefined;
	eventType?: string | undefined;
	eventListener?: ((this: Element, ev: Event) => any) | undefined;
}

const renderComponent = (options: IRenderAndPerformActionsOptions) => {
	const { overrideField, eventType, eventListener } = options;

	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						referenceKey: REFERENCE_KEY,
						label: LABEL,
						items: ITEMS,
						...overrideField,
					},
				},
			},
		},
	};
	return render(<FrontendEngineWithEventListener data={json} eventType={eventType} eventListener={eventListener} />);
};

const maskTestSuite = (variant: "box" | "accordion") => {
	describe("mask / unmask", () => {
		it("should be able to mask / unmask uinfin if mask = uinfin", async () => {
			renderComponent({
				overrideField: { variant, items: [{ label: "NRIC", value: "S1234567D", mask: "uinfin" }] },
			});

			expect(screen.getByText("S••••567D")).toBeInTheDocument();
			expect(screen.getByTestId("masked-icon")).toBeInTheDocument();

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));

			expect(screen.getByText("S1234567D")).toBeInTheDocument();
		});

		it("should be able to mask / unmask entire value if mask = whole", async () => {
			const value = "John Doe";
			renderComponent({
				overrideField: { variant, items: [{ label: "Name", value, mask: "whole" }] },
			});

			expect(screen.getByText("•".repeat(value.length))).toBeInTheDocument();
			expect(screen.getByTestId("masked-icon")).toBeInTheDocument();

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));

			expect(screen.getByText("John Doe")).toBeInTheDocument();
		});

		it("should call unmask api provided and update with unmasked value", async () => {
			const unmaskSchema = { url: "url", body: { hello: "world" } };
			const mockUnmaskedValue = "S1234567D";
			const unmaskSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValue({ data: { value: mockUnmaskedValue } });

			renderComponent({
				overrideField: {
					variant,
					items: [{ label: "NRIC", value: "S****567D", mask: "uinfin", unmask: unmaskSchema }],
				},
			});

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));

			expect(unmaskSpy).toHaveBeenCalledWith(unmaskSchema.url, unmaskSchema.body, {
				headers: { "Content-Type": "application/json" },
			});
			expect(screen.getByText(mockUnmaskedValue)).toBeInTheDocument();
		});

		it("should not call unmask api again if it has been unmasked successfully before", async () => {
			const unmaskSchema = { url: "url", body: { hello: "world" } };
			const mockUnmaskedValue = "S1234567D";
			const unmaskSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValue({ data: { value: mockUnmaskedValue } });

			renderComponent({
				overrideField: {
					variant,
					items: [{ label: "NRIC", value: "S****567D", mask: "uinfin", unmask: unmaskSchema }],
				},
			});

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));
			await waitFor(() => fireEvent.click(screen.getByTestId("unmasked-icon")));
			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));

			expect(unmaskSpy).toHaveBeenCalledTimes(1);
		});

		it("should error on unmask failure", async () => {
			const unmaskSchema = { url: "url", body: { hello: "world" } };
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue({});

			renderComponent({
				overrideField: {
					variant,
					items: [{ label: "NRIC", value: "S****567D", mask: "uinfin", unmask: unmaskSchema }],
				},
			});

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));

			expect(screen.getByText("Error")).toBeInTheDocument();
			expect(screen.getByText("Try again?")).toBeInTheDocument();
		});

		it("should be able to retry a failed unmask attempt", async () => {
			const mockUnmaskedValue = "S1234567D";
			const unmaskSchema = { url: "url", body: { hello: "world" } };
			const unmaskErrorSpy = jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValueOnce({});
			const unmaskSuccessSpy = jest
				.spyOn(AxiosApiClient.prototype, "post")
				.mockResolvedValue({ data: { value: mockUnmaskedValue } });

			renderComponent({
				overrideField: {
					variant,
					items: [{ label: "NRIC", value: "S****567D", mask: "uinfin", unmask: unmaskSchema }],
				},
			});

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));
			await waitFor(() => fireEvent.click(screen.getByText("Try again?")));

			expect(screen.getByText(mockUnmaskedValue)).toBeInTheDocument();
			expect(unmaskErrorSpy).toHaveBeenCalled();
			expect(unmaskSuccessSpy).toHaveBeenCalled();
		});

		it("should show alert message with error and try again after 3 consecutive failed unmask attempts", async () => {
			const unmaskSchema = { url: "url", body: { hello: "world" } };
			jest.spyOn(AxiosApiClient.prototype, "post").mockRejectedValue({});

			renderComponent({
				overrideField: {
					variant,
					items: [{ label: "NRIC", value: "S****567D", mask: "uinfin", unmask: unmaskSchema }],
				},
			});

			await waitFor(() => fireEvent.click(screen.getByTestId("masked-icon")));
			await waitFor(() => fireEvent.click(screen.getByText("Try again?")));
			await waitFor(() => fireEvent.click(screen.getByText("Try again?")));

			expect(screen.getByText("Error")).toBeInTheDocument();
			expect(screen.getByText("Try again?")).toBeInTheDocument();
			expect(screen.getByText("You can still submit form with this error")).toBeInTheDocument();
		});
	});
};

const topBottomSectionTestSuite = (variant: "box" | "accordion") => {
	describe("top / bottom sections", () => {
		it("should be able to render the topSection", () => {
			renderComponent({
				overrideField: {
					variant,
					description: DESCRIPTION,
					topSection: {
						alertTop: {
							uiType: "alert",
							type: "warning",
							children: ALERT_TOP,
						},
					},
				},
			});

			expect(screen.getByText(ALERT_TOP)).toBeInTheDocument();
		});

		it("should be able to render the bottomSection", () => {
			renderComponent({
				overrideField: {
					variant,
					description: DESCRIPTION,
					bottomSection: {
						alertBottom: {
							uiType: "alert",
							type: "warning",
							children: ALERT_BOTTOM,
						},
					},
				},
			});

			expect(screen.getByText(ALERT_BOTTOM)).toBeInTheDocument();
		});
	});
};

describe(REFERENCE_KEY, () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	describe("box variant", () => {
		it("should be able to render the field", () => {
			renderComponent({ overrideField: { variant: "box", description: DESCRIPTION } });

			expect(screen.getByText(LABEL)).toBeInTheDocument();
			expect(screen.getByText(DESCRIPTION)).toBeInTheDocument();
			expect(screen.getByText(ITEMS[0].label)).toBeInTheDocument();
			expect(screen.getByText(ITEMS[1].value)).toBeInTheDocument();
		});

		maskTestSuite("box");
		topBottomSectionTestSuite("box");
	});

	describe("accordion variant", () => {
		it("should be able to render the field", () => {
			renderComponent({ overrideField: { variant: "accordion" } });

			expect(screen.getByText(LABEL)).toBeInTheDocument();
			expect(getField("button", "Edit")).toBeInTheDocument();
			expect(screen.getByText(ITEMS[0].label)).toBeInTheDocument();
			expect(screen.getByText(ITEMS[1].value)).toBeInTheDocument();
		});

		it("should be able to customise button label", () => {
			const buttonLabel = "Modify";
			renderComponent({ overrideField: { variant: "accordion", button: { label: buttonLabel } } });

			expect(getField("button", buttonLabel)).toBeInTheDocument();
		});

		it("should be able to hide button", () => {
			renderComponent({ overrideField: { variant: "accordion", button: false } });

			expect(getField("button", "Edit", true)).not.toBeInTheDocument();
		});

		describe("events", () => {
			it("should fire mount event on mount", () => {
				const testFn = jest.fn();
				renderComponent({
					eventType: "mount",
					eventListener: testFn,
					overrideField: { variant: "accordion" },
				});

				expect(testFn).toHaveBeenCalled();
			});

			it("should fire edit event on clicking edit button", async () => {
				const testFn = jest.fn();
				renderComponent({
					eventType: "edit",
					eventListener: testFn,
					overrideField: { variant: "accordion" },
				});

				await waitFor(() => fireEvent.click(getField("button", "Edit")));
				expect(testFn).toHaveBeenCalled();
			});
		});

		maskTestSuite("accordion");
		topBottomSectionTestSuite("accordion");
	});
});
