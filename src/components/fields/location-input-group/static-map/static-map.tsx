import React, { useEffect, useRef, useState } from "react";
import { MediaWidths } from "@lifesg/react-design-system/media";
import { OneMapService } from "src/services";
import StaticMapPlaceholder from "../../../../assets/img/map/static_map_placeholder.png";
import { StaticMapElement, StaticMapWrapper, staticMapDimensions } from "./static-map.styles";
import { IColor } from "../types";

export interface Props {
	lat?: number;
	lng?: number;
	address?: string;
	pinColor?: IColor;
	className?: string;
	onClick?: () => void;
}

// #1976D5
export const StaticMap = ({ lat, lng, address, pinColor = { r: 28, g: 118, b: 213 }, className, onClick }: Props) => {
	const isMobile = useRef(false);
	const [mapSrc, setMapSrc] = useState<string>("");
	const renderedCenter = useRef<[number, number]>([0, 0]);

	const reloadImage = () => {
		if (!lat || !lng) return;
		const newIsMobile = window.matchMedia(`(max-width: ${MediaWidths.mobileL}px)`).matches;
		if (
			isMobile.current !== newIsMobile ||
			renderedCenter.current[0] !== lat ||
			renderedCenter.current[1] !== lng
		) {
			isMobile.current = newIsMobile;
			const mapDimensions = newIsMobile ? staticMapDimensions.mobile : staticMapDimensions.desktop;
			const oneMapCreditsOverlayHeight = 15;
			const mapHeight = mapDimensions.height + oneMapCreditsOverlayHeight;
			setMapSrc(OneMapService.getStaticMap(lat, lng, mapDimensions.width, mapHeight, pinColor));
			renderedCenter.current = [lat, lng];
		}
	};

	useEffect(() => {
		window.addEventListener("resize", reloadImage);
		if (lat && lng) {
			reloadImage();
		}

		return () => {
			window.removeEventListener("resize", reloadImage);
		};
	}, [lat, lng]);

	if (!lat || !lng) return null;

	return (
		<StaticMapWrapper className={className} onClick={onClick}>
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
