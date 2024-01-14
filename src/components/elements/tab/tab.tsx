import { Tab as DSTab } from "@lifesg/react-design-system/tab";
import { useEffect, useState } from "react";
import { TestHelper } from "../../../utils";
import { IGenericElementProps } from "../types";
import { Wrapper } from "../wrapper";
import { ITabSchema } from "./types";

export const Tab = (props: IGenericElementProps<ITabSchema>) => {
	// =========================================================================
	// CONST, STATE, REF
	// =========================================================================
	const {
		id,
		schema: { currentActive, children },
	} = props;
	const [currentTab, setCurrentTab] = useState(currentActive ?? 0);

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setCurrentTab(currentActive);
	}, [currentActive]);

	// =========================================================================
	// EVENT HANDLERS
	// =========================================================================
	const handleTabClick = (_title: string, index: number) => {
		setCurrentTab(index);
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	return (
		<DSTab
			id={id}
			data-testid={TestHelper.generateId(id, "tab")}
			currentActive={currentTab}
			onTabClick={handleTabClick}
		>
			{Object.entries(children).map(([childId, childSchema]) => {
				const { title, children } = childSchema;
				return (
					<DSTab.Item
						key={childId}
						id={childId}
						data-testid={TestHelper.generateId(childId, "tab-item")}
						title={title}
					>
						<Wrapper>{children}</Wrapper>
					</DSTab.Item>
				);
			})}
		</DSTab>
	);
};
