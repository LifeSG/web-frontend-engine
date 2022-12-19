import { render, screen } from "@testing-library/react";
import { ITextbodySchema } from "../../../../components/elements";
import { FrontendEngine, IFrontendEngineData } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { FRONTEND_ENGINE_ID, TOverrideField, TOverrideSchema } from "../../../common";

const submitFn = jest.fn();
const componentId = "field";
const fieldType = "textbody";
const componentTestId = TestHelper.generateId(componentId, "textbody");

const renderComponent = (overrideField?: TOverrideField<ITextbodySchema>, overrideSchema?: TOverrideSchema) => {
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
		const fields: Record<string, ITextbodySchema> = {
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

		expect(screen.getByTestId(componentTestId).tagName).toBe("DIV");
		expect(screen.getByTestId(TestHelper.generateId(fieldOneId, "textbody"))).toBeInTheDocument();
		expect(screen.getByTestId(TestHelper.generateId(fieldTwoId, "textbody"))).toBeInTheDocument();
	});
});
