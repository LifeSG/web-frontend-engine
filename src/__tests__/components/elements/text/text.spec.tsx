import { render, screen } from "@testing-library/react";
import { ITextSchema, TTextType } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "text-body";
const componentTestId = TestHelper.generateId(componentId, "text");

const renderComponent = (
	overrideField?: Partial<Omit<ITextSchema, "label">> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		fields: {
			[componentId]: {
				fieldType,
				children: "Textbody",
				...overrideField,
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={submitFn} />);
};

describe(fieldType, () => {
	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
	});

	it.each<TTextType>([
		"text-d1",
		"text-d2",
		"text-dbody",
		"text-h1",
		"text-h2",
		"text-h3",
		"text-h4",
		"text-h5",
		"text-h6",
		"text-body",
		"text-bodysmall",
		"text-xsmall",
	])("should be able to render Text.%s component", (type) => {
		const text = "hello world";
		renderComponent({ fieldType: type, children: text });

		expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("should be able to render an array of strings", () => {
		const childrenContent = ["apple", "berry", "cherry"];
		renderComponent({ children: childrenContent });

		screen.getByTestId(componentTestId).childNodes.forEach((child) => {
			expect(childrenContent.includes(child.textContent));
		});
	});

	it("should be able to render an object of text", () => {
		const fieldOneId = "field1";
		const fieldTwoId = "field2";
		const fields: Record<string, ITextSchema> = {
			[fieldOneId]: {
				fieldType,
				children: "field one",
			},
			[fieldTwoId]: {
				fieldType,
				children: "field two",
			},
		};
		renderComponent({ children: fields });

		// NOTE: Parent container should be transformed into a div
		expect(screen.getByTestId(componentTestId).tagName).toBe("DIV");
		expect(screen.getByText("field one")).toBeInTheDocument();
		expect(screen.getByText("field two")).toBeInTheDocument();
	});

	it("should be able to render a HTML string", () => {
		renderComponent({ children: "<div>This is a HTML string</div>" });

		expect(screen.getByText("This is a HTML string")).toBeInTheDocument();
	});

	it("should be able to sanitize HTML string", () => {
		const consoleSpy = jest.spyOn(console, "log");
		renderComponent({
			children: "<div>This is a sanitized string<script>console.log('hello world')</script></div>",
		});

		expect(screen.getByText("This is a sanitized string")).toBeInTheDocument();
		expect(consoleSpy).not.toBeCalled();
	});
});
