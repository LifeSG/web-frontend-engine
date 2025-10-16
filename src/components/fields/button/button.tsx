import { Button } from "@lifesg/react-design-system/button";
import * as Icons from "@lifesg/react-icons";
import styled from "styled-components";
import { IGenericFieldProps } from "..";
import { IButtonSchema, TLinkTarget } from "./types";
import { useFieldEvent } from "../../../utils/hooks";

export const ButtonField = (props: IGenericFieldProps<IButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const {
		schema: {
			label,
			// eslint-disable-next-line @typescript-eslint/no-unused-vars
			uiType,
			startIcon,
			endIcon,
			href,
			target,
			...otherSchema
		},
		id,
		...otherProps
	} = props;
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
		<CustomButton type="button" {...otherSchema} {...otherProps} onClick={handleClick}>
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
		gap: 0.5rem;
	}
`;
