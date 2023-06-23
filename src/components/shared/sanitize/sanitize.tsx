import { renderToStaticMarkup } from "react-dom/server";
import sanitize, { IOptions } from "sanitize-html";
import { TestHelper } from "../../../utils";

interface IProps {
	id?: string;
	children: string | React.ReactNode;
	sanitizeOptions?: IOptions;
}

export const Sanitize = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { id, children, sanitizeOptions } = props;

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const formatHTMLString = (): string => {
		if (typeof children !== "string") {
			return renderToStaticMarkup(children as JSX.Element);
		}
		return children;
	};

	const getSanitizedHtml = (): string => {
		return sanitize(formatHTMLString(), sanitizeOptions);
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
