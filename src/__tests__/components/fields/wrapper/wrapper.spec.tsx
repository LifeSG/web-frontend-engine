import { render, screen } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { TWrapperType } from "../../../../components/fields/wrapper";
import { IFrontendEngineData, TFrontendEngineFieldSchema } from "../../../../components/frontend-engine";

const renderComponent = (
	wrapperType: TWrapperType = "div",
	wrapperChildren?: Record<string, TFrontendEngineFieldSchema> | string
) => {
	const children = wrapperChildren || {
		field1: {
			label: "Field 1",
			fieldType: "text",
		},
	};
	const json: IFrontendEngineData = {
		id: "test",
		fields: {
			wrapper: {
				fieldType: wrapperType,
				children,
			},
			submit: {
				label: "Submit",
				fieldType: "submit",
			},
		},
	};
	return render(<FrontendEngine data={json} />);
};

describe("wrapper", () => {
	it("should be able to render other fields as children", () => {
		renderComponent();

		expect(screen.getByTestId("field1")).toBeInTheDocument();
		expect(screen.getByTestId("field1").tagName).toBe("INPUT");
	});

	it("should be able to render string as children", () => {
		const text = "hello world";
		renderComponent(undefined, text);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("should be able to render nested children", () => {
		renderComponent(undefined, {
			nested: {
				fieldType: "div",
				children: {
					field1: {
						label: "Field 1",
						fieldType: "text",
					},
				},
			},
		});

		expect(screen.getByTestId("nested")).toBeInTheDocument();
		expect(screen.getByTestId("field1")).toBeInTheDocument();
		expect(screen.getByTestId("field1").tagName).toBe("INPUT");
	});

	it.each<TWrapperType>(["div", "span", "section", "header", "footer", "h1", "h2", "h3", "h4", "h5", "h6", "p"])(
		"should be able to render with %s element type",
		(type) => {
			const text = "hello world";
			const component = renderComponent(type, text);

			expect(component.container.querySelector(`${type.toLowerCase()}#wrapper`)).toBeInTheDocument();
			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);
});
