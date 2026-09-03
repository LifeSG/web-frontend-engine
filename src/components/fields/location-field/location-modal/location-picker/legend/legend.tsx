import { CrossIcon } from "@lifesg/react-icons/cross";
import { Typography } from "@lifesg/react-design-system/typography";
import { Button } from "@lifesg/react-design-system/button";
import * as styles from "./legend.styles";
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
		<div className={styles.legendWrapper} data-testid={TestHelper.generateId(id, "legend")} aria-label="Map Legend">
			<div className={styles.legendHeader}>
				<Typography.BodyMD weight="semibold">Legend</Typography.BodyMD>
				<Button
					className={styles.closeButton}
					data-testid={TestHelper.generateId(id, "legend-close")}
					onClick={onClose}
					icon={<CrossIcon />}
				/>
			</div>
			<div className={styles.legendContent}>
				{items.map((item) => (
					<div className={styles.legendItem} key={item.id}>
						<img className={styles.legendIcon} src={item.icon} alt={item.label} />
						<Typography.BodySM>{item.label}</Typography.BodySM>
					</div>
				))}
			</div>
		</div>
	);
};
