/* eslint-disable react/prop-types */
import React from "react";
import { Text } from "react-lifesg-design-system";
import { ChipButton } from "./chip.styles";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export const Chip = ({ children, ...otherProps }: IProps) => (
	<ChipButton type="button" {...otherProps}>
		<Text.XSmall className="chipText" weight="semibold">
			{children}
		</Text.XSmall>
	</ChipButton>
);
