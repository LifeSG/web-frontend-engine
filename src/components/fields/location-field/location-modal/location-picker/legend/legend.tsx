import { CrossIcon } from "@lifesg/react-icons/cross";
import { Typography } from "@lifesg/react-design-system/typography";
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
				<Typography.BodyMD weight="semibold">Legend</Typography.BodyMD>
				<CloseButton data-testid={TestHelper.generateId(id, "legend-close")} onClick={onClose}>
					<CrossIcon />
				</CloseButton>
			</LegendHeader>
			<LegendContent>
				{items.map((item) => (
					<LegendItem key={item.id}>
						<LegendIcon src={item.icon} alt={item.label} />
						<Typography.BodySM>{item.label}</Typography.BodySM>
					</LegendItem>
				))}
			</LegendContent>
		</LegendWrapper>
	);
};
