import { IColor } from "../../../services/onemap/types";
export interface IStaticMapProps {
    id: string;
    lat?: number | undefined;
    lng?: number | undefined;
    address?: string | undefined;
    staticMapPinColor?: IColor | undefined;
    className?: string | undefined;
    onClick?: () => void | undefined;
    disabled?: boolean | undefined;
}
export declare const StaticMap: ({ id, lat, lng, address, staticMapPinColor, className, onClick, disabled, }: IStaticMapProps) => import("react/jsx-runtime").JSX.Element;
