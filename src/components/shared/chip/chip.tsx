/* eslint-disable react/prop-types */
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import React from "react";
import { ChipButton } from "./chip.styles";
import { IChipButtonProps } from "./types";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, IChipButtonProps {}

export const Chip = ({ children, ...otherProps }: IProps) => (
	<ChipButton type="button" aria-pressed={otherProps?.isActive} {...otherProps}>
		<V2_Text.XSmall weight="semibold">{children}</V2_Text.XSmall>
	</ChipButton>
);
