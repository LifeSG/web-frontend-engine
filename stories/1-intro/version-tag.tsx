import React from "react";
import { Color, Text } from "react-lifesg-design-system";
import styled from "styled-components";
import { version } from "../../package.json";

interface Props {
	link: string;
}

export const VersionTags = ({ link }: Props) => {
	return (
		<Container>
			<Badge href={`${link}/browse?at=refs%2Ftags%2Fv${version}`} target="_blank" rel="noopener noreferrer">
				<Left type="stable">
					<Label weight="semibold">Alpha</Label>
				</Left>
				<Right>
					<Label weight="bold">v{version}</Label>
				</Right>
			</Badge>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
`;

const Badge = styled.a`
	border-radius: 0.25rem;
	display: flex;
	&:not(:last-child) {
		margin-right: 1rem;
	}
`;

interface LeftProps {
	type: "stable" | "latest";
}
const Left = styled.div<LeftProps>`
	padding: 0.25rem 0.5rem 0.45rem;
	border-top-left-radius: 0.25rem;
	border-bottom-left-radius: 0.25rem;
	background: ${(props) => (props.type === "stable" ? Color.Brand[2] : Color.Accent.Light[1])};
`;

const Right = styled.div`
	padding: 0.25rem 0.5rem 0.45rem;
	background: ${Color.Neutral[2]};
	border-top-right-radius: 0.25rem;
	border-bottom-right-radius: 0.25rem;
`;

const Label = styled(Text.XSmall)`
	color: white;
	line-height: 0;
`;
