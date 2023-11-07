import { UneditableSectionItemProps } from "@lifesg/react-design-system";
import { action } from "@storybook/addon-actions";
import { Description, Stories, Title } from "@storybook/addon-docs";
import { Meta, StoryFn } from "@storybook/react";
import { useEffect, useRef } from "react";
import { IReviewSchema } from "../../../components/custom";
import { IFrontendEngineRef } from "../../../components/frontend-engine";
import { FrontendEngine, SUBMIT_BUTTON_SCHEMA } from "../../common";

const SAMPLE_ITEMS: UneditableSectionItemProps[] = [
	{
		label: "Name (as in NRIC or passport)",
		value: "Tom Tan Li Ho",
		displayWidth: "half",
	},
	{
		label: "NRIC or FIN",
		value: "S••••534J",
		displayWidth: "half",
	},
	{
		label: "Date of birth",
		value: "6 November 1992",
		displayWidth: "half",
	},
	{
		label: "Residential Address",
		value: "Block 287, #05-11, Tampines street 22, Singapore 534788",
		displayWidth: "half",
	},
	{
		label: "Ethnicity",
		value: "Chinese",
	},
];
const meta: Meta = {
	title: "Custom/Review/Events",
	parameters: {
		docs: {
			page: () => (
				<>
					<Title>Events for Edit button when variant {`'accordion'`}</Title>
					<Description>
						Custom events unique to the Accordion, it allows adding of event listeners to it.
					</Description>
					<Stories includePrimary={true} title="Examples" />
				</>
			),
			source: {
				code: null,
			},
		},
	},
};
export default meta;

/* eslint-disable react-hooks/rules-of-hooks */
const Template = (eventName: string) =>
	((args) => {
		const id = `review-accordion-${eventName}`;
		const formRef = useRef<IFrontendEngineRef>();
		const handleEvent = (e: unknown) => action(eventName)(e);
		useEffect(() => {
			const currentFormRef = formRef.current;
			currentFormRef.addFieldEventListener(eventName, id, handleEvent);
			return () => currentFormRef.removeFieldEventListener(eventName, id, handleEvent);
			// eslint-disable-next-line react-hooks/exhaustive-deps
		}, []);
		return (
			<FrontendEngine
				ref={formRef}
				data={{
					sections: {
						section: {
							uiType: "section",
							children: {
								[id]: args,
								...SUBMIT_BUTTON_SCHEMA,
							},
						},
					},
				}}
			/>
		);
	}) as StoryFn<IReviewSchema>;
/* eslint-enable react-hooks/rules-of-hooks */

export const Mount = Template("mount").bind({});
Mount.args = {
	referenceKey: "review",
	variant: "accodion",
	title: "Your personal information",
	button: { label: "Edit" },
	items: SAMPLE_ITEMS,
};
export const ButtonClick = Template("button-click").bind({});
ButtonClick.args = {
	referenceKey: "review",
	variant: "accodion",
	title: "Your personal information",
	button: { label: "Edit" },
	items: SAMPLE_ITEMS,
};
