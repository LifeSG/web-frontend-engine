import { Button, ButtonIconPosition } from "@lifesg/react-design-system/button";
import * as Icons from "@lifesg/react-icons";
import clsx from "clsx";
import { IGenericFieldProps } from "..";
import { useFieldEvent } from "../../../utils/hooks";
import { filterSchemaProps } from "../../../utils/prop-helper";
import { IButtonSchema } from "./types";
import * as styles from "./button.styles";

export const ButtonField = (props: IGenericFieldProps<IButtonSchema>) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, schema } = props;
	const {
		commonSchema: { label },
		customSchema: { className, endIcon, href, startIcon, target, ...buttonProps },
	} = filterSchemaProps(schema);
	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = (icon?: IButtonSchema["startIcon"] | IButtonSchema["endIcon"] | undefined) => {
		if (!icon) return undefined;
		const Element = Icons[icon];

		return <Element />;
	};

	const getIconProps = (): { icon: JSX.Element; iconPosition: ButtonIconPosition } | Record<string, never> => {
		if (startIcon) {
			return {
				icon: renderIcon(startIcon),
				iconPosition: "left",
			};
		}
		if (endIcon) {
			return {
				icon: renderIcon(endIcon),
				iconPosition: "right",
			};
		}

		return {};
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
		<Button
			type="button"
			{...buttonProps}
			{...getIconProps()}
			onClick={handleClick}
			className={clsx(styles.customButton, className)}
		>
			{label}
		</Button>
	);
};
