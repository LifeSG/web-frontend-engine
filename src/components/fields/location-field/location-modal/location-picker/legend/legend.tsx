import { CrossIcon } from "@lifesg/react-icons/cross";
import { Text } from "@lifesg/react-design-system/text";
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
				<Text.H5 weight="semibold">Legend</Text.H5>
				<CloseButton onClick={onClose}>
					<CrossIcon />
				</CloseButton>
			</LegendHeader>
			<LegendContent>
				{items.map((item) => (
					<LegendItem key={item.id}>
						{item.icon}
						<Text.H6 as="p">{item.label}</Text.H6>
					</LegendItem>
				))}
			</LegendContent>
		</LegendWrapper>
	);
};
