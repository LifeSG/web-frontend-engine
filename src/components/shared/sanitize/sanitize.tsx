import { renderToStaticMarkup } from "react-dom/server";
import sanitize, { IOptions } from "sanitize-html";
import { TestHelper } from "../../../utils";

interface IProps {
	children: string | React.ReactNode;
	className?: string | undefined;
	id?: string | undefined;
	sanitizeOptions?: IOptions;
}

export const Sanitize = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { children, className, id, sanitizeOptions } = props;

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
	return (
		<span
			id={formatId()}
			className={className}
			data-testid={formatId()}
			dangerouslySetInnerHTML={{ __html: getSanitizedHtml() }}
		/>
	);
};
