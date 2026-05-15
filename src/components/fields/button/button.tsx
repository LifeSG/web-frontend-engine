import { Button } from "@lifesg/react-design-system/button";
import { Spacing } from "@lifesg/react-design-system/theme";
import * as Icons from "@lifesg/react-icons";
import styled from "styled-components";
import { IGenericFieldProps } from "..";
import { useFieldEvent } from "../../../utils/hooks";
import { filterSchemaProps } from "../../../utils/prop-helper";
import { IButtonSchema } from "./types";

export const ButtonField = (props: IGenericFieldProps<IButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const {
		commonSchema: { label },
		customSchema: { endIcon, href, startIcon, target, ...buttonProps },
	} = filterSchemaProps(schema);
	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = (icon?: IButtonSchema["startIcon"] | IButtonSchema["endIcon"] | undefined) => {
		if (!icon) return null;
		const Element = Icons[icon];

		return <Element />;
	};

	const isValidUrl = (url: string): boolean => {
		try {
			return !!new URL(url);
		} catch {
			return false;
		}
	};

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		dispatchFieldEvent("click", id, e);
		if (href && isValidUrl(href)) {
			if (target) {
				window.open(href, target, "noopener noreferrer");
			} else {
				window.location.href = href;
			}
		}
	};

	return (
		<CustomButton type="button" {...buttonProps} onClick={handleClick}>
			{renderIcon(startIcon)}
			{label}
			{renderIcon(endIcon)}
		</CustomButton>
	);
};

const CustomButton = styled(Button.Default)`
	> span {
		display: flex;
		align-items: center;
		gap: ${Spacing["spacing-8"]};
	}
`;
