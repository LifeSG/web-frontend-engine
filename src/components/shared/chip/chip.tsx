/* eslint-disable react/prop-types */
import React from "react";
import { Text } from "@lifesg/react-design-system";
import { ChipButton } from "./chip.styles";

export const Chip = ({ children, ...otherProps }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
	<ChipButton type="button" {...otherProps}>
		<Text.XSmall className="chipText" weight="semibold">
			{children}
		</Text.XSmall>
	</ChipButton>
);
