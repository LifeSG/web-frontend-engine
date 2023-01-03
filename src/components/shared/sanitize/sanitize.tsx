import { sanitize } from "dompurify";
import { renderToStaticMarkup } from "react-dom/server";
import { TestHelper } from "../../../utils";

interface IProps {
	id?: string;
	content: string | React.ReactNode;
}

export const Sanitize = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, content } = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatHTMLString = (): string => {
		if (typeof content !== "string") {
			return renderToStaticMarkup(content as JSX.Element);
		}
		return content;
	};

	const getSanitizedHtml = (): string => {
		return sanitize(formatHTMLString());
	};

	const formatId = (): string => {
		if (id) {
			return TestHelper.generateId(id, "sanitized");
		}
		return TestHelper.generateId("sanitized");
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return <span id={formatId()} data-testid={formatId()} dangerouslySetInnerHTML={{ __html: getSanitizedHtml() }} />;
};
