/* eslint-disable react/prop-types */
import React from "react";
import { ChipButton, ChipText } from "./chip.styles";
import { IChipButtonProps } from "./types";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {}

export const Chip = ({ children, ...otherProps }: IProps) => (
	<ChipButton type="button" aria-pressed={otherProps?.isActive} {...otherProps}>
		<ChipText weight="semibold">{children}</ChipText>
	</ChipButton>
);
