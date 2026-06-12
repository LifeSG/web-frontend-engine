import { useEffect, useState } from "react";
import { IColor } from "../../../services/onemap/types";
import { TestHelper } from "../../../utils";
import { LocationHelper } from "../../fields/location-field/location-helper";
import { StaticMapElement, StaticMapWrapper, staticMapDimensions } from "./static-map.styles";
import { useMaxWidthMediaQuery } from "@lifesg/react-design-system/theme";

const StaticMapPlaceholder = "https://assets.life.gov.sg/web-frontend-engine/img/map/static_map_placeholder.png";

export interface IStaticMapProps {
	id: string;
	lat?: number | undefined;
	lng?: number | undefined;
	address?: string | undefined;
	staticMapPinColor?: IColor | undefined;
	className?: string | undefined;
	onClick?: () => void | undefined;
	disabled?: boolean | undefined;
}

export const StaticMap = ({
	id,
	lat,
	lng,
	address,
	staticMapPinColor = { r: 28, g: 118, b: 213 },
	className,
	onClick,
	disabled,
}: IStaticMapProps) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const isMobile = useMaxWidthMediaQuery("sm");
	const [mapSrc, setMapSrc] = useState<string>("");
	// =============================================================================
	// EFFECTS
	// =============================================================================
	useEffect(() => {
		if (lat && lng) {
			reloadImage();
		}
	}, [lat, lng, isMobile]);

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================

	const reloadImage = () => {
		if (!lat || !lng) return;
		const mapDimensions = isMobile ? staticMapDimensions.mobile : staticMapDimensions.desktop;
		const oneMapCreditsOverlayHeight = 15;
		const mapHeight = mapDimensions.height + oneMapCreditsOverlayHeight;
		setMapSrc(LocationHelper.getStaticMapUrl(lat, lng, mapDimensions.width, mapHeight, staticMapPinColor));
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================

	if (!lat || !lng) return null;

	return (
		<StaticMapWrapper
			id={TestHelper.generateId(id, "static-map")}
			data-testid={TestHelper.generateId(id, "static-map")}
			className={className}
			onClick={onClick}
			aria-disabled={disabled}
		>
			<StaticMapElement
				alt={address || "Location Map"}
				src={mapSrc}
				onError={(e) => {
					e.currentTarget.src = StaticMapPlaceholder;
				}}
			/>
		</StaticMapWrapper>
	);
};
