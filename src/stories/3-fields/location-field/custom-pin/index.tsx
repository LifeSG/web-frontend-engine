import { CustomPinContainer, HomePinImage, PinCount, PinIconImage, PinIconWrapper } from "./index.styles";

export interface ICustomPinProps {
	icons?: string[];
	count?: number | undefined;
}

export interface ICustomHomePinProps {
	iconUrl?: string | undefined;
}

export const CustomPin = ({ icons = [], count }: ICustomPinProps) => {
	const showCount = count !== undefined && count !== null;

	return (
		<CustomPinContainer>
			<PinIconWrapper>
				{icons.map((icon, index) => (
					<PinIconImage key={`${icon}-${index}`} src={icon} alt="" />
				))}
			</PinIconWrapper>

			{showCount && <PinCount>{count}</PinCount>}
		</CustomPinContainer>
	);
};

export const CustomHomePin = ({ iconUrl = "" }: ICustomHomePinProps) => <HomePinImage src={iconUrl} alt="" />;
