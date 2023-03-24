import { IFrontendEngineData } from "../../components/frontend-engine";

export type TOverrideField<T> = Partial<Omit<T, "uiType" | "label">> | undefined;
export type TOverrideSchema = Partial<Omit<IFrontendEngineData, "fields">> | undefined;
