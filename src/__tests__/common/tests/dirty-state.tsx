import { fireEvent, render, screen } from "@testing-library/react";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../components/types";
import { FrontendEngineWithCustomButton, getResetButton } from "../helper";

interface IDirtyStateTestSuiteOptions {
	schema: IFrontendEngineData;
	componentId: string;
	defaultValue: unknown;
	modifyField: () => unknown;
}

export const dirtyStateTestSuite = (options: IDirtyStateTestSuiteOptions) =>
	describe("dirty state", () => {
		const { schema, componentId, defaultValue, modifyField } = options;
		let formIsDirty: boolean | undefined;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};

		beforeEach(() => {
			formIsDirty = undefined;
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={schema} onClick={handleClick} />);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={schema} onClick={handleClick} />);
			await modifyField();
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...schema, defaultValues: { [componentId]: defaultValue } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={schema} onClick={handleClick} />);
			await modifyField();
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});

		it("should reset to default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...schema, defaultValues: { [componentId]: defaultValue } }}
					onClick={handleClick}
				/>
			);
			await modifyField();
			fireEvent.click(getResetButton());
			fireEvent.click(screen.getByRole("button", { name: "Custom Button" }));

			expect(formIsDirty).toBe(false);
		});
	});
