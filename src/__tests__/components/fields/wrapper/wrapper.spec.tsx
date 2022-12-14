import { render, screen } from "@testing-library/react";
import { FrontendEngine } from "../../../../components";
import { TWrapperType } from "../../../../components/fields/wrapper";
import { IFrontendEngineData, TFrontendEngineFieldSchema } from "../../../../components/frontend-engine";
import { TestHelper } from "../../../../utils";
import { SUBMIT_BUTTON_ID } from "../../../common";

const parentId = "wrapper";
const parentFieldType = "div";
const childId = "field1";
const childFieldType = "text";

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
		id: "test",
		fields: {
			wrapper: {
				fieldType: wrapperType,
				children,
			},
			[SUBMIT_BUTTON_ID]: {
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

		expect(screen.getByRole("textbox", { name: childId })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: childId }).tagName).toBe("INPUT");
	});

	it("should be able to render string as children", () => {
		const text = "hello world";
		renderComponent(undefined, text);

		expect(screen.getByText(text)).toBeInTheDocument();
	});

	it("should be able to render nested children", () => {
		const nestedId = "nested";
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

		expect(screen.getByRole("generic", { name: nestedId })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: childId })).toBeInTheDocument();
		expect(screen.getByRole("textbox", { name: childId }).tagName).toBe("INPUT");
	});

	it.each`
		role             | element
		${"generic"}     | ${"div"}
		${"generic"}     | ${"span"}
		${"region"}      | ${"section"}
		${"banner"}      | ${"header"}
		${"contentinfo"} | ${"footer"}
		${"heading"}     | ${"h1"}
		${"heading"}     | ${"h2"}
		${"heading"}     | ${"h3"}
		${"heading"}     | ${"h4"}
		${"heading"}     | ${"h5"}
		${"heading"}     | ${"h6"}
		${null}          | ${"p"}
	`("should be able to render with $element element type", ({ role, element }) => {
		const text = "hello world";
		renderComponent(element, text);

		if (role) {
			expect(screen.getByRole(role, { name: parentId })).toBeInTheDocument();
		} else {
			expect(screen.getByTestId(TestHelper.generateId(parentId, element))).toBeInTheDocument();
		}

		expect(screen.getByText(text)).toBeInTheDocument();
	});
});
