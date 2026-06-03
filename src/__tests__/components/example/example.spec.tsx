import { fireEvent, render, screen } from "@testing-library/react";
import { ExampleCard } from "../../../components/example/example";

describe("ExampleCard", () => {
	afterEach(() => {
		jest.resetAllMocks();
	});

	it("should render with default props", () => {
		render(<ExampleCard />);

		expect(screen.getByRole("heading", { name: "Example Card" })).toBeInTheDocument();
		expect(screen.getByText("This is a simple example card component.")).toBeInTheDocument();
		expect(screen.getByRole("button", { name: "Click Me" })).toBeInTheDocument();
	});

	it("should call onButtonClick when button is clicked", () => {
		const mockOnClick = jest.fn();
		render(<ExampleCard onButtonClick={mockOnClick} />);

		const button = screen.getByRole("button", { name: "Click Me" });
		fireEvent.click(button);

		expect(mockOnClick).toHaveBeenCalledTimes(1);
	});
});
