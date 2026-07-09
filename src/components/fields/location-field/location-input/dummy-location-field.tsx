import { PinFillIcon } from "@lifesg/react-icons/pin-fill";
import clsx from "clsx";
import * as styles from "./location-input.styles";

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
		<button
			id={id}
			data-testid={dataTestId}
			type="button"
			className={clsx(
				styles.dummyLocationInput,
				readOnly && styles.dummyLocationInputReadOnly,
				disabled && styles.dummyLocationInputDisabled,
				error && styles.dummyLocationInputError,
				className
			)}
			disabled={disabled}
			onFocus={onFocus}
			onClick={handleClick}
			tabIndex={disabled ? -1 : 0}
			aria-disabled={disabled || undefined}
			aria-haspopup="dialog"
		>
			{placeholder && !value ? (
				<span
					className={clsx(
						styles.locationInputText,
						styles.locationInputTextPlaceholder,
						disabled && styles.locationInputTextDisabled
					)}
				>
					{placeholder}
				</span>
			) : (
				<span className={clsx(styles.locationInputText, disabled && styles.locationInputTextDisabled)}>
					{value}
				</span>
			)}
			<div
				className={clsx(
					styles.locationIconWrapper,
					disabled && styles.locationIconWrapperDisabled,
					readOnly && styles.locationIconWrapperReadOnly
				)}
				aria-hidden="true"
			>
				<PinFillIcon />
			</div>
		</button>
	);
};
