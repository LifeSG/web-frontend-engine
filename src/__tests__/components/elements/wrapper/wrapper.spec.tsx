import { render, screen, waitFor } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { TWrapperType } from "../../../../components/elements/wrapper";
import { IFrontendEngineData, TFrontendEngineFieldSchema } from "../../../../components/frontend-engine";
import { ERROR_MESSAGES } from "../../../../components/shared";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, getSubmitButtonProps } from "../../../common";

const PARENT_ID = "wrapper";
const PARENT_FIELD_TYPE = "div";
const CHILD_ID = "field1";
const CHILD_FIELD_TYPE = "text-field";
const CHILD_TEST_ID = TestHelper.generateId(CHILD_ID, CHILD_FIELD_TYPE);

const renderComponent = (
	wrapperType: TWrapperType = "div",
	wrapperChildren?: Record<string, TFrontendEngineFieldSchema> | string
) => {
	const children = wrapperChildren || {
		[CHILD_ID]: {
			label: "Field 1",
			uiType: CHILD_FIELD_TYPE,
		},
	};
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[PARENT_ID]: {
						uiType: wrapperType,
						children: children as any,
					},
					...getSubmitButtonProps(),
				},
			},
		},
	};
	return render(<FrontendEngine data={json} />);
};

describe("wrapper", () => {
	it("should be able to render other fields as children", async () => {
		renderComponent();

		await waitFor(() => expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument());
		expect(screen.getByTestId(CHILD_TEST_ID).tagName).toBe("INPUT");
	});

	it("should be able to render string as children", () => {
		const text = "hello world";
		renderComponent(undefined, text);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("should not render unsupported components", () => {
		renderComponent(undefined, {
			unsupported: {
				uiType: "unknown",
			},
		} as any);

		expect(screen.getByText(ERROR_MESSAGES.GENERIC.UNSUPPORTED)).toBeInTheDocument();
	});

	it("should be able to render nested children", async () => {
		const nestedId = "nested";
		const nestedTestId = TestHelper.generateId(nestedId, PARENT_FIELD_TYPE);
		renderComponent(undefined, {
			[nestedId]: {
				uiType: PARENT_FIELD_TYPE,
				children: {
					[CHILD_ID]: {
						label: "Field 1",
						uiType: CHILD_FIELD_TYPE,
					},
				},
			},
		});

		await waitFor(() => expect(screen.getByTestId(nestedTestId)).toBeInTheDocument());
		expect(screen.getByTestId(CHILD_TEST_ID)).toBeInTheDocument();
		expect(screen.getByTestId(CHILD_TEST_ID).tagName).toBe("INPUT");
	});

	it.each<TWrapperType>(["div", "span", "header", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "p"])(
		"should be able to render with %s element type",
		(type) => {
			const text = "hello world";
			renderComponent(type, text);

			expect(screen.getByTestId(TestHelper.generateId(PARENT_ID, type))).toBeInTheDocument();
			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);
});
