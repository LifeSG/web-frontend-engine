import { Button } from "@lifesg/react-design-system/button";
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
		customSchema: { className, icon, iconPosition, href, target, ...buttonProps },
	} = filterSchemaProps(schema);
	const { dispatchFieldEvent } = useFieldEvent();

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderIcon = () => {
		if (!icon) return undefined;
		const IconComponent = Icons[icon];
		return <IconComponent />;
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
			icon={renderIcon()}
			iconPosition={iconPosition}
			onClick={handleClick}
			className={clsx(styles.customButton, className)}
		>
			{label}
		</Button>
	);
};
