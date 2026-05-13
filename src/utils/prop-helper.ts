import omit from "lodash/omit";

const COMMON_SCHEMA_PROP_KEYS = [
	"columns",
	"customOptions",
	"label",
	"referenceKey",
	"showIf",
	"uiType",
	"validation",
] as const;

type CommonSchemaPropKey = (typeof COMMON_SCHEMA_PROP_KEYS)[number];
type ExistingCommonSchemaPropKey<T extends object> = Extract<CommonSchemaPropKey, keyof T>;

export const filterSchemaProps = <T extends object>(schema: T) => {
	const commonKeys = COMMON_SCHEMA_PROP_KEYS.filter((key) => key in schema) as ExistingCommonSchemaPropKey<T>[];

	return {
		commonSchema: Object.fromEntries(commonKeys.map((key) => [key, schema[key]])) as Pick<
			T,
			ExistingCommonSchemaPropKey<T>
		>,
		customSchema: omit(schema, commonKeys) as Omit<T, ExistingCommonSchemaPropKey<T>>,
	};
};
