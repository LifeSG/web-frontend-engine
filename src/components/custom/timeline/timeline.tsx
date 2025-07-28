import { Timeline as DSTimeline } from "@lifesg/react-design-system/timeline";
import { Typography } from "@lifesg/react-design-system/typography";
import * as Icons from "@lifesg/react-icons";
import { useEffect } from "react";
import * as Yup from "yup";
import { useValidationConfig } from "../../../utils/hooks";
import { Wrapper } from "../../elements/wrapper";
import { Sanitize } from "../../shared";
import { IGenericCustomElementProps } from "../types";
import { ITimelineSchema } from "./types";

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
					<Typography.BodyBL>
						<Sanitize inline>{children}</Sanitize>
					</Typography.BodyBL>
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
