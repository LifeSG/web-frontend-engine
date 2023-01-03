import { render, screen } from "@testing-library/react";
import { ITextSchema, TTextType } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "Body";
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

	it.each<TTextType>(["D1", "D2", "DBody", "H1", "H2", "H3", "H4", "H5", "H6", "Body", "BodySmall", "XSmall"])(
		"should be able to render Text.%s component",
		(type) => {
			const text = "hello world";
			renderComponent({ fieldType: type, children: text });

			expect(screen.getByTestId(componentTestId)).toBeInTheDocument();
			expect(screen.getByText(text)).toBeInTheDocument();
		}
	);

	it("should be able to render an array of strings", () => {
		const childrenContent = ["apple", "berry", "cherry"];
		renderComponent({ children: childrenContent });

		screen.getByTestId(componentTestId).childNodes.forEach((child) => {
			expect(childrenContent.includes(child.textContent));
		});
	});

	it("should be able to render an object of textbody", () => {
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
		expect(screen.getByTestId(TestHelper.generateId(fieldOneId, "text"))).toBeInTheDocument();
		expect(screen.getByTestId(TestHelper.generateId(fieldTwoId, "text"))).toBeInTheDocument();
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
