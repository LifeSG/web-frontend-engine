/* eslint-disable react/prop-types */
import { Typography } from "@lifesg/react-design-system/typography";
import React from "react";
import { ChipButton } from "./chip.styles";
import { IChipButtonProps } from "./types";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {}

export const Chip = ({ children, ...otherProps }: IProps) => (
	<ChipButton type="button" aria-pressed={otherProps?.isActive} {...otherProps}>
		<Typography.BodyXS weight="semibold">{children}</Typography.BodyXS>
	</ChipButton>
);
