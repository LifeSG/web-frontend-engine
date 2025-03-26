import { Timeline as DSTimeline } from "@lifesg/react-design-system/timeline";
import { V2_Text } from "@lifesg/react-design-system/v2_text";
import * as Icons from "@lifesg/react-icons";
import { useEffect } from "react";
import * as Yup from "yup";
import { useValidationConfig } from "../../../utils/hooks";
import { Sanitize } from "../../shared";
import { IGenericCustomElementProps } from "../types";
import { ITimelineSchema } from "./types";
import { Wrapper } from "../../elements/wrapper";

export const Timeline = (props: IGenericCustomElementProps<ITimelineSchema>) => {
	// =========================================================================
	// CONST, STATE, REF
	// =========================================================================
	const {
		id,
		schema: { items, label, ...otherSchema },
	} = props;
	const { setFieldValidationConfig, removeFieldValidationConfig } = useValidationConfig();

	// =========================================================================
	// EFFECTS
	// =========================================================================
	useEffect(() => {
		// set validation config so frontend engine's first onChange event can be fired
		setFieldValidationConfig(id, Yup.string());
		return () => {
			removeFieldValidationConfig(id);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// =========================================================================
	// HELPER FUNCTIONS
	// =========================================================================
	const buildItems = () => {
		return items.map(({ children, label, statuses, ...restOfItem }) => {
			let itemContent: React.ReactNode;
			if (typeof children === "string") {
				itemContent = (
					<V2_Text.Body>
						<Sanitize inline>{children}</Sanitize>
					</V2_Text.Body>
				);
			} else {
				itemContent = <Wrapper>{children}</Wrapper>;
			}

			return {
				content: itemContent,
				statuses: statuses?.map(({ icon, ...restOfStatus }) => {
					const Element = Icons[icon];
					return {
						icon: Element ? <Element /> : undefined,
						...restOfStatus,
					};
				}),
				title: label,
				...restOfItem,
			};
		});
	};

	// =========================================================================
	// RENDER FUNCTIONS
	// =========================================================================
	const timelineItems = buildItems();

	return <DSTimeline {...otherSchema} items={timelineItems} title={label} />;
};
