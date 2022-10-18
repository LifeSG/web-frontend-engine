import { ISubmitButtonSchema } from "src/components/fields";

export const ExcludeReactFormHookProps = {
	invalid: { table: { disable: true } },
	isTouched: { table: { disable: true } },
	isDirty: { table: { disable: true } },
	error: { table: { disable: true } },
	onChange: { table: { disable: true } },
	onBlur: { table: { disable: true } },
	value: { table: { disable: true } },
	name: { table: { disable: true } },
};

export const SubmitButtonStorybook: ISubmitButtonSchema = {
	type: "SUBMIT",
	id: "submit-button",
	title: "Submit",
};
