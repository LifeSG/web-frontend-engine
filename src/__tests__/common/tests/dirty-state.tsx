import { act, fireEvent, render } from "@testing-library/react";
import { IFrontendEngineData, IFrontendEngineRef } from "../../../components/types";
import { FrontendEngineWithCustomButton, getCustomButton, getResetButton } from "../helper";

interface IDirtyStateTestSuiteOptions {
	schema: IFrontendEngineData;
	componentId: string;
	defaultValue: unknown;
	modifyField: () => unknown;
	modifyAndRemoveField?: () => unknown;
	beforeEach?: () => void;
}

/**
 * The test suites for dirty state. It will test the following scenarios:
 * 1. Should mount without setting field state as dirty
 * 2. Should set form state as dirty if user modifies the field
 * 3. Should support default value without setting form state as dirty
 * 4. Should reset and revert form dirty state to false
 * 5. Should reset to default value without setting form state as dirty
 */
export const dirtyStateTestSuite = (options: IDirtyStateTestSuiteOptions) =>
	describe("dirty state", () => {
		const { schema, componentId, defaultValue, modifyField, beforeEach: setup, modifyAndRemoveField } = options;
		let formIsDirty: boolean | undefined;
		const handleClick = (ref: React.MutableRefObject<IFrontendEngineRef>) => {
			formIsDirty = ref.current.isDirty;
		};

		beforeEach(async () => {
			formIsDirty = undefined;
			setup?.();
		});

		it("should mount without setting field state as dirty", () => {
			render(<FrontendEngineWithCustomButton data={schema} onClick={handleClick} />);
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});

		it("should set form state as dirty if user modifies the field", async () => {
			render(<FrontendEngineWithCustomButton data={schema} onClick={handleClick} />);
			await modifyField();
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(true);
		});

		it("should support default value without setting form state as dirty", async () => {
			render(
				<FrontendEngineWithCustomButton
					data={{ ...schema, defaultValues: { [componentId]: defaultValue } }}
					onClick={handleClick}
				/>
			);
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});

		it("should reset and revert form dirty state to false", async () => {
			render(<FrontendEngineWithCustomButton data={schema} onClick={handleClick} />);
			await modifyField();
			fireEvent.click(getResetButton());
			fireEvent.click(getCustomButton());

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
			fireEvent.click(getCustomButton());

			expect(formIsDirty).toBe(false);
		});

		if (modifyAndRemoveField) {
			it("should set form state as dirty if user modifies and then removes the field", async () => {
				render(
					<FrontendEngineWithCustomButton
						data={{ ...schema, defaultValues: { [componentId]: defaultValue } }}
						onClick={handleClick}
					/>
				);
				await modifyAndRemoveField?.();
				fireEvent.click(getCustomButton());

				expect(formIsDirty).toBe(true);
			});
		}
	});
