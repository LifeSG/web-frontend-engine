import { Meta, StoryFn } from "@storybook/react";
import { ExampleCard, ExampleCardProps } from "../../components/example/example";

const meta: Meta<typeof ExampleCard> = {
	title: "Example/Example Card",
	component: ExampleCard,
	argTypes: {
		onButtonClick: {
			action: "clicked",
		},
	},
};

export default meta;

const Template: StoryFn<ExampleCardProps> = (args) => <ExampleCard {...args} />;

export const Default = Template.bind({});
Default.args = {};

export const CustomContent = Template.bind({});
CustomContent.args = {
	title: "Custom Title",
	description: "You can customize all the content!",
	buttonText: "Get Started",
};
