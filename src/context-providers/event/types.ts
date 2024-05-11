import { TCustomEvents } from "../../components/custom";
import { TFieldEvents, TFieldTriggers } from "../../components/fields";
import { TFieldEventListener } from "../../utils";

type TDefaultAddFieldEventListener = <T = any>(
	type: string,
	id: string,
	callback: TFieldEventListener<T>,
	options?: boolean | AddEventListenerOptions | undefined
) => void;
type TDefaultDispatchFieldEvent = <T = any>(type: string, id: string, detail?: T) => boolean;

export type TAddFieldEventListener = TDefaultAddFieldEventListener & TFieldEvents & TCustomEvents;
export type TDispatchFieldEvent = TDefaultDispatchFieldEvent & TFieldTriggers;
export type TRemoveFieldEventListener = TAddFieldEventListener;
