import styled from "styled-components";

export const ChipContainer = styled.div<{ showTextarea?: boolean | undefined }>`
	display: flex;
	flex-wrap: wrap;
	gap: 0.5rem;
	margin: ${({ showTextarea }) => (showTextarea ? "0.5rem 0 1rem" : "0.5rem 0")};
`;
