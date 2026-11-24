import { ILegendItem } from "../../../types";
interface ILegendProps {
    onClose?: (() => void) | undefined;
    items?: ILegendItem[] | undefined;
    id?: string | undefined;
}
export declare const Legend: ({ onClose, items, id }: ILegendProps) => import("react/jsx-runtime").JSX.Element;
export {};
