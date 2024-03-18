import { useFormSchema } from "../../../utils/hooks";
import { Section } from "../section";
import { ISectionsProps } from "./types";

/**
 * this component is meant to render "pages" which consists of individual Section component
 * it is not rendering in pages yet because there are no use cases yet
 * so this is just a placeholder for now
 *
 * this component renders the sections object and cannot be defined via `uiType`
 * i.e. it is used internally only
 *
 * TODO:
 * - render pages properly
 * - handle validation and errors in each section before navigating away
 */
export const Sections = (props: ISectionsProps) => {
	// =============================================================================
	// CONST, STATE, REF
	// =============================================================================
	const { schema } = props;
	const {
		formSchema: { overrides },
		overrideSchema,
	} = useFormSchema();

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderSections = () => {
		const overriddenSchema = overrideSchema(schema, overrides);
		if (overriddenSchema) {
			return Object.entries(overriddenSchema).map(([id, section], i) => (
				<Section key={`section-${i}`} id={id} sectionSchema={section} />
			));
		} else {
			return (
				<>
					Unable to render Frontend Engine schema, make sure schema is declared within <code>sections</code>.
				</>
			);
		}
	};

	return <>{renderSections()}</>;
};
