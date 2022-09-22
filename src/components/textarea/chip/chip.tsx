/* eslint-disable react/prop-types */
import React from "react";
import { Text } from "react-lifesg-design-system";
import { ChipButton } from "./chip.styles";
import { IChipProps } from "./types";

export const Chip = ({ children, ...otherProps }: IChipProps) => (
	<ChipButton type="button" {...otherProps}>
		<Text.XSmall className="chipText" weight="semibold">
			{children}
		</Text.XSmall>
	</ChipButton>
);
