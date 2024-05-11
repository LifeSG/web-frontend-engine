import { render, screen } from "@testing-library/react";
import { Warning } from "../../../components/shared";

const FIELD_ID = "field";

describe("Warning", () => {
	it("should render warning", () => {
		const message = "this is a warning";
		render(<Warning id={FIELD_ID} message={message} />);

		expect(screen.getByText(message)).toBeInTheDocument();
		expect(screen.getByTestId(`${FIELD_ID}__warning`)).toBeInTheDocument();
	});

	it("should not render warning if message is not provided", () => {
		render(<Warning id={FIELD_ID} />);

		expect(screen.queryByTestId(`${FIELD_ID}__warning`)).not.toBeInTheDocument();
	});
});
