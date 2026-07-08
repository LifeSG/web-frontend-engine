import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import clsx from "clsx";
import { DummyLocationInput, LocationIconWrapper, LocationInputText } from "./location-input.styles";

interface IDummyLocationFieldProps {
	id?: string | undefined;
	"data-testid"?: string | undefined;
	disabled?: boolean | undefined;
	readOnly?: boolean | undefined;
	placeholder?: string | undefined;
	value?: string | number | readonly string[] | undefined;
	error?: boolean | undefined;
	onFocus: React.FocusEventHandler<HTMLElement>;
	className?: string | undefined;
}

export const DummyLocationField = (props: IDummyLocationFieldProps) => {
	const { id, "data-testid": dataTestId, className, disabled, readOnly, onFocus, value, placeholder, error } = props;

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (disabled) return;

		e.currentTarget.focus();
	};

	return (
		<DummyLocationInput
			id={id}
			data-testid={dataTestId}
			type="button"
			className={clsx(
				readOnly && "dummyLocationInputReadOnly",
				disabled && "dummyLocationInputDisabled",
				error && "dummyLocationInputError",
				className
			)}
			disabled={disabled}
			onFocus={onFocus}
			onClick={handleClick}
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			aria-haspopup="dialog"
			aria-readonly={readOnly}
		>
			{placeholder && !value ? (
				<LocationInputText
					className={clsx("locationInputTextPlaceholder", disabled && "locationInputTextDisabled")}
				>
					{placeholder}
				</LocationInputText>
			) : (
				<LocationInputText className={clsx(disabled && "locationInputTextDisabled")}>{value}</LocationInputText>
			)}
			<LocationIconWrapper
				className={clsx(disabled && "locationIconWrapperDisabled", readOnly && "locationIconWrapperReadOnly")}
				aria-hidden="true"
			>
				<PinFillIcon />
			</LocationIconWrapper>
		</DummyLocationInput>
	);
};
