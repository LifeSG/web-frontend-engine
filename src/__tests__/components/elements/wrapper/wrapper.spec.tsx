import { render, screen } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { TWrapperType } from "../../../../components/elements/wrapper";
import { IFrontendEngineData, TFrontendEngineFieldSchema } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, getSubmitButtonProps } from "../../../common";

const parentId = "wrapper";
const parentFieldType = "div";
const childId = "field1";
const childFieldType = "text";
const childTestId = TestHelper.generateId(childId, childFieldType);

const renderComponent = (
	wrapperType: TWrapperType = "div",
	wrapperChildren?: Record<string, TFrontendEngineFieldSchema> | string
) => {
	const children = wrapperChildren || {
		[childId]: {
			label: "Field 1",
			fieldType: childFieldType,
		},
	};
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			wrapper: {
				fieldType: wrapperType,
				children,
			},
			...getSubmitButtonProps(),
		},
	};
	return render(<FrontendEngine data={json} />);
};

describe("wrapper", () => {
	it("should be able to render other fields as children", () => {
		renderComponent();

		expect(screen.getByTestId(childTestId)).toBeInTheDocument();
		expect(screen.getByTestId(childTestId).tagName).toBe("INPUT");
	});

	it("should be able to render string as children", () => {
		const text = "hello world";
		renderComponent(undefined, text);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("should be able to render nested children", () => {
		const nestedId = "nested";
		const nestedTestId = TestHelper.generateId(nestedId, parentFieldType);
		renderComponent(undefined, {
			[nestedId]: {
				fieldType: parentFieldType,
				children: {
					[childId]: {
						label: "Field 1",
						fieldType: childFieldType,
					},
				},
			},
		});

		expect(screen.getByTestId(nestedTestId)).toBeInTheDocument();
		expect(screen.getByTestId(childTestId)).toBeInTheDocument();
		expect(screen.getByTestId(childTestId).tagName).toBe("INPUT");
	});

	it.each<TWrapperType>(["div", "span", "section", "header", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "p"])(
		"should be able to render with %s element type",
		(type) => {
			const text = "hello world";
			renderComponent(type, text);

			expect(screen.getByTestId(TestHelper.generateId(parentId, type))).toBeInTheDocument();
			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);
});
