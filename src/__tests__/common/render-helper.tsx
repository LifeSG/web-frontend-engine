import { RenderResult, render } from "@testing-library/react";
import { FrontendEngine } from "../../components";
import { IFrontendEngineData, IFrontendEngineProps, TFrontendEngineFieldSchema } from "../../components/types";
import { FRONTEND_ENGINE_ID } from "./data";
import { getResetButtonProps, getSubmitButtonProps } from "./helper";
import { TOverrideField, TOverrideSchema } from "./types";

interface ICreateRenderComponentOptions {
	componentId: string;
	baseSchema: Record<string, unknown>;
	submitFn?: jest.Mock;
	includeReset?: boolean;
	engineProps?: Partial<Omit<IFrontendEngineProps, "data" | "onSubmit">>;
}

export function createRenderComponent<TFieldSchema>(options: ICreateRenderComponentOptions) {
	const { componentId, baseSchema, submitFn = jest.fn(), includeReset = true, engineProps } = options;

	const baseJsonSchema: IFrontendEngineData = {
		id: FRONTEND_ENGINE_ID,
		sections: {
			section: {
				uiType: "section",
				children: {
					[componentId]: baseSchema as TFrontendEngineFieldSchema,
					...getSubmitButtonProps(),
					...(includeReset ? getResetButtonProps() : {}),
				},
			},
		},
	};

	const renderFn = (overrideField?: TOverrideField<TFieldSchema>, overrideSchema?: TOverrideSchema): RenderResult => {
		const json: IFrontendEngineData = JSON.parse(JSON.stringify(baseJsonSchema));
		if (overrideSchema) {
			Object.assign(json, { ...overrideSchema, sections: json.sections });
		}
		if (overrideField) {
			Object.assign(json.sections.section.children[componentId] as object, overrideField);
		}
		return render(<FrontendEngine {...engineProps} data={json} onSubmit={submitFn} />);
	};

	renderFn.schema = baseJsonSchema;

	return renderFn;
}
