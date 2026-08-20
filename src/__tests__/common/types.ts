import { RenderResult } from "@testing-library/react";
import { IFrontendEngineData } from "../../components/frontend-engine";

export type TOverrideField<T> = Partial<Omit<T, "uiType">> | undefined;
export type TOverrideSchema = Partial<Omit<IFrontendEngineData, "sections">> | undefined;
export type TRenderComponent<T = unknown> = (
	overrideField?: TOverrideField<T>,
	overrideSchema?: TOverrideSchema
) => Promise<RenderResult> | RenderResult;
