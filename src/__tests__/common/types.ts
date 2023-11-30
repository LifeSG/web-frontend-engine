import { IFrontendEngineData } from "../../components/frontend-engine";

export type TOverrideField<T> = Partial<Omit<T, "uiType">> | undefined;
export type TOverrideSchema = Partial<Omit<IFrontendEngineData, "sections">> | undefined;
