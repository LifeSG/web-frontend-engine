import { Markup, MarkupProps } from "@lifesg/react-design-system/markup";
import { renderToStaticMarkup } from "react-dom/server";
import sanitize, { IOptions } from "sanitize-html";
import { TestHelper } from "../../../utils";

interface IProps {
	baseTextColor?: MarkupProps["baseTextColor"] | undefined;
	baseTextSize?: MarkupProps["baseTextSize"] | undefined;
	children: string | React.ReactNode;
	className?: string | undefined;
	id?: string | undefined;
	inline?: boolean | undefined;
	sanitizeOptions?: IOptions;
}

export const Sanitize = (props: IProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { baseTextColor, baseTextSize, children, className, id, inline, sanitizeOptions } = props;

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

	const generateTestId = (): string => {
		if (id) {
			return TestHelper.generateId(id, "sanitized");
		}
		return TestHelper.generateId("sanitized");
	};

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	return (
		<Markup
			baseTextColor={baseTextColor}
			baseTextSize={baseTextSize}
			inline={inline}
			id={id}
			className={className}
			data-testid={generateTestId()}
			dangerouslySetInnerHTML={{ __html: getSanitizedHtml() }}
		/>
	);
};
