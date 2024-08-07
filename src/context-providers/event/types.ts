import { TCustomEvents } from "../../components/custom";
import { TElementEvents } from "../../components/elements";
import { TFieldEvents, TFieldTriggers } from "../../components/fields";
import { TFieldEventListener } from "../../utils";

type TDefaultAddFieldEventListener = <T = any>(
	type: string,
	id: string,
	callback: TFieldEventListener<T>,
	options?: boolean | AddEventListenerOptions | undefined
) => void;
type TDefaultDispatchFieldEvent = <T = any>(type: string, id: string, detail?: T) => boolean;

export type TAddFieldEventListener = TDefaultAddFieldEventListener & TFieldEvents & TElementEvents & TCustomEvents;
export type TDispatchFieldEvent = TDefaultDispatchFieldEvent & TFieldTriggers;
export type TRemoveFieldEventListener = TAddFieldEventListener;
