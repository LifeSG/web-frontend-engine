/* eslint-disable react/prop-types */
import { Text } from "@lifesg/react-design-system/text";
import React from "react";
import { ChipButton } from "./chip.styles";
import { IChipButtonProps } from "./types";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {}

export const Chip = ({ children, ...otherProps }: IProps) => (
	<ChipButton type="button" {...otherProps}>
		<Text.XSmall weight="semibold">{children}</Text.XSmall>
	</ChipButton>
);
