import { ICustomComponentJsonSchema } from "../../../frontend-engine";

export interface IFilterItemCheckboxSchema extends ICustomComponentJsonSchema {
	label: string;
	options: IOption[];
}

export interface IFilterItemCheckboxProps {
	id?: string | undefined;
	schema?: IFilterItemCheckboxSchema | undefined;
	warnings?: Record<string, string> | undefined;
}

interface IOption {
	label: string;
	value: string;
}
