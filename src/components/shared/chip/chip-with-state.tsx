import { useEffect, useState } from "react";
import { Chip } from "./chip";

interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	id?: string;
	toggleShowTextArea?: () => void;
	onChange?: () => void;
	text: string;
	isEnabled?: boolean;
	isInitiallyActive?: boolean;
}

export const ChipWithState = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const {
		id,
		toggleShowTextArea,
		onChange,
		text,
		isEnabled = true,
		isInitiallyActive = false,
		...otherProps
	} = props;

	const [isActive, setIsActive] = useState<boolean>(isInitiallyActive);

	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (isInitiallyActive) {
			setIsActive(true);
		}
	}, [isInitiallyActive]);

	useEffect(() => {
		if (!isEnabled) {
			setIsActive(false);
		}
	}, [isEnabled]);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleClick = () => {
		if (onChange) {
			onChange();
		}

		if (toggleShowTextArea) {
			toggleShowTextArea();
		}

		setIsActive(!isActive);
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Chip id={id} type="button" {...otherProps} isActive={isActive} onClick={handleClick}>
			{text}
		</Chip>
	);
};
