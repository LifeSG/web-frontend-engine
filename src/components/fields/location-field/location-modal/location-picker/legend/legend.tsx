import { CrossIcon } from "@lifesg/react-icons/cross";
import { Typography } from "@lifesg/react-design-system";
import { CloseButton, LegendContent, LegendHeader, LegendItem, LegendWrapper } from "./legend.styles";
import { PinFillIcon } from "@lifesg/react-icons";

const LEGEND_ITEMS = [
	{ id: "lift-fault", icons: require("./lift.png"), label: "Lift fault" },
	{ id: "renovation-1", icons: require("./lift.png"), label: "Renovation work" },
	// { id: "renovation-2", label: "Renovation Work Work Work Work" },
	// { id: "renovation-3", label: "Renovation Work Work Work Work" },
	// { id: "renovation-4", label: "Renovation Work Work Work Work" },
];

interface ILegendProps {
	onClose?: () => void;
}

export const Legend = ({ onClose }: ILegendProps) => {
	return (
		<LegendWrapper>
			<LegendHeader>
				<Typography.BodyMD weight="bold">Legend</Typography.BodyMD>
				<CloseButton onClick={onClose}>
					<CrossIcon />
				</CloseButton>
			</LegendHeader>
			<LegendContent>
				{LEGEND_ITEMS.map((item) => (
					<LegendItem key={item.id}>
						{/* <PinFillIcon /> */}
						<img src={item.icons} alt={`${item.label} icon`} />
						<Typography.BodySM>{item.label}</Typography.BodySM>
					</LegendItem>
				))}
			</LegendContent>
		</LegendWrapper>
	);
};
