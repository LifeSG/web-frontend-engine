import { Tab as DSTab } from "@lifesg/react-design-system/tab";
import isEmpty from "lodash/isEmpty";
import isObject from "lodash/isObject";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useDeepCompareEffectNoCheck } from "use-deep-compare-effect";
import { TestHelper } from "../../../utils";
import { useCallbacks, useValidationConfig } from "../../../utils/hooks";
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
		schema: { currentActiveTabId, children, ...otherTabSchema },
	} = props;
	const [currentTabIndex, setCurrentTabIndex] = useState(getCurrentTabIndex());
	const [pendingTabChangeCallback, setPendingTabChangeCallback] = useState(false);
	const { removeFieldValidationConfig } = useValidationConfig();
	const { unregister } = useFormContext();
	const { callbacks } = useCallbacks();

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		setCurrentTabIndex(getCurrentTabIndex());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentActiveTabId]);

	useDeepCompareEffectNoCheck(() => {
		Object.values(children).forEach((childSchema, index) => {
			if (index === currentTabIndex) {
				return;
			}
			const idsToDelete = listAllChildIds(childSchema);
			idsToDelete.forEach((idToDelete) => {
				removeFieldValidationConfig(idToDelete);
				unregister(idToDelete);
			});
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTabIndex, children]);

	useEffect(() => {
		if (pendingTabChangeCallback) {
			// Trigger callback after unregister has completed and form has re-rendered
			callbacks?.onTabChange?.();
			setPendingTabChangeCallback(false);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentTabIndex, pendingTabChangeCallback]);

	// =========================================================================
	// EVENT HANDLERS
	// =========================================================================
	const handleTabClick = (_title: string, index: number) => {
		setCurrentTabIndex(index);
		setPendingTabChangeCallback(true);
	};

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	function getCurrentTabIndex() {
		const index = Object.keys(children).findIndex((childId) => childId === currentActiveTabId);
		return index < 0 ? 0 : index;
	}

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
			{...otherTabSchema}
			id={id}
			data-testid={TestHelper.generateId(id, "tab")}
			currentActive={currentTabIndex}
			onTabClick={handleTabClick}
		>
			{Object.entries(children).map(([childId, childSchema]) => {
				const { title, children, ...otherTabItemSchema } = childSchema;
				return (
					<DSTab.Item
						{...otherTabItemSchema}
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
