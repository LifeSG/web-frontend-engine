import { IImage } from "../../types";
interface IProps {
    onDecideClearDrawing: (decision?: boolean) => void;
    onDecideDelete: (decision: boolean) => void;
    onDecideExit: (decision?: boolean) => void;
    id?: string;
    images: IImage[];
    show?: "delete" | "exit" | "clear-drawing";
}
export declare const ImagePrompts: (props: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
