import { HomeBadgeImage, PinBadgeContainer, PinCount, PinIconImage, PinIconWrapper } from "./map-pin-badge.styles";

export interface IMapPinBadgeProps {
	icons?: string[];
	count?: number | undefined;
}

export interface IMapHomeBadgeProps {
	iconUrl?: string | undefined;
}

export const MapPinBadge = ({ icons = [], count }: IMapPinBadgeProps) => {
	const showCount = count !== undefined && count !== null;

	return (
		<PinBadgeContainer>
			<PinIconWrapper>
				{icons.map((icon, index) => (
					<PinIconImage key={`${icon}-${index}`} src={icon} alt="" />
				))}
			</PinIconWrapper>

			{showCount && <PinCount>{count}</PinCount>}
		</PinBadgeContainer>
	);
};

export const MapHomeBadge = ({ iconUrl = "" }: IMapHomeBadgeProps) => <HomeBadgeImage src={iconUrl} alt="" />;
