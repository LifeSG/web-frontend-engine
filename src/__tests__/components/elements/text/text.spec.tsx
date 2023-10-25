import { render, screen } from "@testing-library/react";
import React from "react";
import { ITextSchema, TTextType, Text } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideSchema } from "../../../common";
const SUBMIT_FN = jest.fn();
const COMPONENT_ID = "field";
const UI_TYPE = "text-body";
const COMPONENT_TEST_ID = TestHelper.generateId(COMPONENT_ID, "text");

const renderComponent = (
	overrideField?: Partial<Omit<ITextSchema, "label">> | undefined,
	overrideSchema?: TOverrideSchema
) => {
	const json: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[COMPONENT_ID]: {
						uiType: UI_TYPE,
						children: "Textbody",
						maxLines: 3,
						...overrideField,
					},
				},
			},
		},
		...overrideSchema,
	};
	return render(<FrontendEngine data={json} onSubmit={SUBMIT_FN} />);
};

describe(UI_TYPE, () => {
	it("should be able to render the field", () => {
		renderComponent();

		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
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
		renderComponent({ uiType: type, children: text });

		expect(screen.getByTestId(COMPONENT_TEST_ID)).toBeInTheDocument();
		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("should be able to render an array of strings", () => {
		const childrenContent = ["apple", "berry", "cherry"];
		renderComponent({ children: childrenContent });

		screen.getByTestId(COMPONENT_TEST_ID).childNodes.forEach((child) => {
			expect(childrenContent.includes(child.textContent));
		});
	});

	it("should be able to render an object of text", () => {
		const fieldOneId = "field1";
		const fieldTwoId = "field2";
		const fields: Record<string, ITextSchema> = {
			[fieldOneId]: {
				uiType: UI_TYPE,
				children: "field one",
			},
			[fieldTwoId]: {
				uiType: UI_TYPE,
				children: "field two",
			},
		};
		renderComponent({ children: fields });

		// NOTE: Parent container should be transformed into a div
		expect(screen.getByTestId(COMPONENT_TEST_ID).tagName).toBe("DIV");
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

	it("should be able to render view more button", () => {
		const childrenContent = ["apple", "berry", "cherry", "orange"];

		// mock useState value
		const useStateSpy = jest.spyOn(React, "useState");
		useStateSpy.mockReturnValueOnce([false, jest.fn()]); // expanded
		useStateSpy.mockReturnValueOnce([true, jest.fn()]); // showExpandButton

		render(
			<Text
				id="test"
				schema={{
					uiType: "text-body",
					children: childrenContent,
					maxLines: 3,
				}}
			/>
		);

		const button = screen.queryByText("View more");
		expect(button).toBeInTheDocument();
	});

	it("should be able to render view less button", () => {
		const childrenContent = ["apple", "berry", "cherry", "orange"];
		// mock useState value
		const useStateSpy = jest.spyOn(React, "useState");
		useStateSpy.mockReturnValueOnce([true, jest.fn()]); // expanded
		useStateSpy.mockReturnValueOnce([true, jest.fn()]); // showExpandButton

		render(
			<Text
				id="test"
				schema={{
					uiType: "text-body",
					children: childrenContent,
					maxLines: 3,
				}}
			/>
		);

		const button = screen.queryByText("View less");
		expect(button).toBeInTheDocument();
	});
});
