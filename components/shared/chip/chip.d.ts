import React from "react";
import { IChipButtonProps } from "./types";
interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {
}
export declare const Chip: ({ children, ...otherProps }: IProps) => import("react/jsx-runtime").JSX.Element;
export {};
