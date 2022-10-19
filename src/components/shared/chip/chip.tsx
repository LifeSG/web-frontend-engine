/* eslint-disable react/prop-types */
import React from "react";
import { Text } from "@lifesg/react-design-system/text";
import { ChipButton } from "./chip.styles";

export const Chip = ({ children, ...otherProps }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<ChipButton type="button" {...otherProps}>
		<Text.XSmall weight="semibold">{children}</Text.XSmall>
	</ChipButton>
);
