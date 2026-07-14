/* eslint-disable react/prop-types */
import clsx from "clsx";
import React from "react";
import { ChipButton, ChipText } from "./chip.styles";
import { IChipButtonProps } from "./types";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {}

export const Chip = ({ children, className, disabled, isActive, ...otherProps }: IProps) => (
	<ChipButton
		type="button"
		aria-pressed={isActive}
		disabled={disabled}
		className={clsx(isActive && "chipButtonActive", disabled && "chipButtonDisabled", className)}
		{...otherProps}
	>
		<ChipText weight="semibold">{children}</ChipText>
	</ChipButton>
);
