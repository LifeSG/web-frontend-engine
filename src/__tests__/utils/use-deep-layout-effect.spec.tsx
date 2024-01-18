import { render } from "@testing-library/react";
import { useDeepLayoutEffect } from "../../utils/hooks";

describe("useDeepLayoutEffect", () => {
	it("should run effect only when primitive dependencies change", () => {
		const TestComponent = (props: { dep: unknown[]; callback: () => void }) => {
			useDeepLayoutEffect(props.callback, props.dep);
			return null;
		};

		const mockCallback = jest.fn();
		const methods = render(<TestComponent dep={[0]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(1);

		methods.rerender(<TestComponent dep={[1]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(2);

		methods.rerender(<TestComponent dep={[1]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(2);
	});

	it("should run effect only when the number of dependencies change", () => {
		const TestComponent = (props: { dep: unknown[]; callback: () => void }) => {
			useDeepLayoutEffect(props.callback, props.dep);
			return null;
		};

		const mockCallback = jest.fn();
		const methods = render(<TestComponent dep={[0]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(1);

		methods.rerender(<TestComponent dep={[0, 0]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(2);
	});

	it("should run effect only when non-primitive dependencies change", () => {
		const TestComponent = (props: { dep: unknown[]; callback: () => void }) => {
			useDeepLayoutEffect(props.callback, props.dep);
			return null;
		};

		const mockCallback = jest.fn();
		const methods = render(<TestComponent dep={[{ count: 0 }]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(1);

		methods.rerender(<TestComponent dep={[{ count: 1 }]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(2);

		methods.rerender(<TestComponent dep={[{ count: 1 }]} callback={mockCallback} />);

		expect(mockCallback).toHaveBeenCalledTimes(2);
	});
});
