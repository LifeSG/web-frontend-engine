import { IColor } from "../../../services/onemap/types";
export interface IStaticMapProps {
    id: string;
    lat?: number | undefined;
    lng?: number | undefined;
    address?: string | undefined;
    staticMapPinColor?: IColor | undefined;
    className?: string | undefined;
    onClick?: () => void | undefined;
}
export declare const StaticMap: ({ id, lat, lng, address, staticMapPinColor, className, onClick, }: IStaticMapProps) => import("react/jsx-runtime").JSX.Element;
