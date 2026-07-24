import { createPortal } from "react-dom";
import styled from "styled-components";

interface IProps {
	logs: string[];
	onClear: () => void;
}

const Panel = styled.aside`
	position: fixed;
	right: 0.75rem;
	bottom: 0.75rem;
	z-index: 2147483647;
	width: min(44rem, calc(100vw - 1.5rem));
	max-height: min(40vh, 24rem);
	overflow: auto;
	padding: 0.75rem;
	border: 1px solid #94a3b8;
	border-radius: 0.5rem;
	background: rgba(15, 23, 42, 0.96);
	box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.35);
	color: #e2e8f0;
	font-family: monospace;
	font-size: 0.75rem;
	line-height: 1.4;
`;

const Header = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-bottom: 0.5rem;
	color: #f8fafc;
	font-weight: 700;
`;

const ClearButton = styled.button`
	border: 1px solid #94a3b8;
	border-radius: 0.25rem;
	background: transparent;
	padding: 0.2rem 0.45rem;
	color: inherit;
	font: inherit;
	cursor: pointer;
`;

const LogLine = styled.div`
	white-space: pre-wrap;
	word-break: break-word;
`;

/** Diagnostic panel for the client-side image compression and upload flow. */
export const ImageUploadDebug = ({ logs, onClear }: IProps) => {
	if (typeof document === "undefined") return null;

	return createPortal(
		<Panel aria-live="polite" aria-label="Image upload debug log">
			<Header>
				<span>Image upload log ({logs.length})</span>
				<ClearButton type="button" onClick={onClear}>
					Clear
				</ClearButton>
			</Header>
			{logs.length
				? logs.map((log, index) => <LogLine key={`${log}-${index}`}>{log}</LogLine>)
				: "Waiting for an image..."}
		</Panel>,
		document.body
	);
};
