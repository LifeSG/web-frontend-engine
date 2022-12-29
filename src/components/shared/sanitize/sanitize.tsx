import { sanitize } from "dompurify";
import { renderToStaticMarkup } from "react-dom/server";
import { TestHelper } from "../../../utils";

interface IProps {
	id?: string;
	htmlString: string | React.ReactNode;
}

export const Sanitize = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, htmlString } = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatHTMLString = (): string => {
		if (typeof htmlString !== "string") {
			return renderToStaticMarkup(htmlString as JSX.Element);
		}
		return htmlString;
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
