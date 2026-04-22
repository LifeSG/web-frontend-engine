import { CrossIcon } from "@lifesg/react-icons/cross";
import { Text } from "@lifesg/react-design-system/text";
import { CloseButton, LegendContent, LegendHeader, LegendIcon, LegendItem, LegendWrapper } from "./legend.styles";
import { ILegendItem } from "../../../types";
import { TestHelper } from "../../../../../../utils";

interface ILegendProps {
	onClose?: (() => void) | undefined;
	items?: ILegendItem[] | undefined;
	id?: string | undefined;
}

export const Legend = ({ onClose, items = [], id = "legend" }: ILegendProps) => {
	if (!items || items.length === 0) {
		return null;
	}

	return (
		<LegendWrapper data-testid={TestHelper.generateId(id, "legend")} aria-label="Map Legend">
			<LegendHeader>
				<Text.H5 weight="semibold">Legend</Text.H5>
				<CloseButton data-testid={TestHelper.generateId(id, "legend-close")} onClick={onClose}>
					<CrossIcon />
				</CloseButton>
			</LegendHeader>
			<LegendContent>
				{items.map((item) => (
					<LegendItem key={item.id}>
						<LegendIcon src={item.icon} alt={item.label} />
						<Text.H6 as="p" weight={"regular"}>
							{item.label}
						</Text.H6>
					</LegendItem>
				))}
			</LegendContent>
		</LegendWrapper>
	);
};
