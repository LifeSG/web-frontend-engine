import { CrossIcon } from "@lifesg/react-icons/cross";
import { Typography } from "@lifesg/react-design-system";
import { CloseButton, LegendContent, LegendHeader, LegendItem, LegendWrapper } from "./legend.styles";
import { ILegendItem } from "../../../types";

interface ILegendProps {
	onClose?: () => void;
	items?: ILegendItem[] | undefined;
}

export const Legend = ({ onClose, items = [] }: ILegendProps) => {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<LegendWrapper>
			<LegendHeader>
				<Typography.BodyMD weight="bold">Legend</Typography.BodyMD>
				<CloseButton onClick={onClose}>
					<CrossIcon />
				</CloseButton>
			</LegendHeader>
			<LegendContent>
				{items.map((item) => (
					<LegendItem key={item.id}>
						{item.icon}
						<Typography.BodySM>{item.label}</Typography.BodySM>
					</LegendItem>
				))}
			</LegendContent>
		</LegendWrapper>
	);
};
