/* eslint-disable react/prop-types */
import clsx from "clsx";
import React from "react";
import { Typography } from "@lifesg/react-design-system/typography";
import * as styles from "./chip.styles";
import { IChipButtonProps } from "./types";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {}

export const Chip = ({ children, className, disabled, isActive, ...otherProps }: IProps) => (
	<button
		type="button"
		aria-pressed={isActive}
		disabled={disabled}
		className={clsx(
			styles.chipButton,
			isActive && styles.chipButtonActive,
			disabled && styles.chipButtonDisabled,
			className
		)}
		{...otherProps}
	>
		<Typography.BodyXS weight="semibold" className={clsx(isActive && styles.chipTextActive)}>
			{children}
		</Typography.BodyXS>
	</button>
);
