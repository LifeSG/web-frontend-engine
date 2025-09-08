import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import { DummyLocationInput, LocationIconWrapper, LocationInputText } from "./location-input.styles";

interface IDummyLocationFieldProps {
	disabled?: boolean;
	readOnly?: boolean;
	placeholder?: string;
	value?: string | number | readonly string[];
	error?: boolean;
	onFocus: (e: React.FocusEvent<HTMLInputElement, Element>) => void;
	className?: string;
}

export const DummyLocationField = (props: IDummyLocationFieldProps) => {
	const { className, disabled, readOnly, onFocus, value, placeholder, error } = props;

	const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (disabled) return;

		e.currentTarget.focus();
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
		if (disabled) return;

		if (e.key === "Enter" || e.key === " ") {
			e.preventDefault();
			e.currentTarget.click();
		}
	};

	return (
		<DummyLocationInput
			className={className}
			$disabled={disabled}
			$readOnly={readOnly}
			$error={error}
			onFocus={onFocus}
			onClick={handleClick}
			onKeyDown={handleKeyDown}
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			role="combobox"
			aria-haspopup="dialog"
			aria-readonly={readOnly}
		>
			{placeholder && !value ? (
				<LocationInputText $placeholder $disabled={disabled}>
					{placeholder}
				</LocationInputText>
			) : (
				<LocationInputText $disabled={disabled}>{value}</LocationInputText>
			)}
			<LocationIconWrapper $disabled={disabled} $readOnly={readOnly} aria-hidden="true">
				<PinFillIcon />
			</LocationIconWrapper>
		</DummyLocationInput>
	);
};
