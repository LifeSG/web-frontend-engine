import { Tab as DSTab } from "@lifesg/react-design-system/tab";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { TestHelper } from "../../../utils";
import { useValidationConfig } from "../../../utils/hooks";
import { TFrontendEngineFieldSchema } from "../../frontend-engine";
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
	const { removeFieldValidationConfig } = useValidationConfig();
	const { unregister } = useFormContext();

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setCurrentTab(currentActive);
	}, [currentActive]);

	useEffect(() => {
		Object.values(children).forEach((childSchema, index) => {
			if (index === currentActive) {
				return;
			}
			const idsToDelete = listAllChildIds(childSchema);
			idsToDelete.forEach((idToDelete) => {
				removeFieldValidationConfig(idToDelete);
				unregister(idToDelete);
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentActive, children]);

	// =========================================================================
	// EVENT HANDLERS
	// =========================================================================
	const handleTabClick = (_title: string, index: number) => {
		setCurrentTab(index);
	};

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const listAllChildIds = (schema: TFrontendEngineFieldSchema) => {
		const children: Record<string, TFrontendEngineFieldSchema> = schema["children"];
		const childIdList: string[] = [];

		// Handle nested fields
		if (isEmpty(children) || !isObject(children)) {
			return childIdList;
		}

		Object.entries(children).forEach(([childId, childSchema]) => {
			childIdList.push(childId);

			// Handle special fields that render additional fields
			if (childSchema.uiType === "chips") {
				childIdList.push(childId + "-textarea");
			}

			if (childSchema["children"]) {
				childIdList.push(...listAllChildIds(childSchema));
			}
		});

		return childIdList;
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
