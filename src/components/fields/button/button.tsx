import { Button } from "@lifesg/react-design-system/button";
import * as Icons from "@lifesg/react-icons";
import styled from "styled-components";
import { IGenericFieldProps } from "..";
import { IButtonSchema, TLinkTarget } from "./types";
import { useFieldEvent } from "../../../utils/hooks";
import { Spacing } from "@lifesg/react-design-system/theme";

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
			const linkTarget: TLinkTarget = target || "_self";

			switch (linkTarget) {
				case "_blank":
					window.open(href, "_blank", "noopener noreferrer");
					break;
				case "_parent":
					if (window.parent) {
						window.parent.location.href = href;
					} else {
						window.location.href = href;
					}
					break;
				case "_top":
					if (window.top) {
						window.top.location.href = href;
					} else {
						window.location.href = href;
					}
					break;
				case "_self":
				default:
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
		gap: ${Spacing["spacing-8"]};
	}
`;
