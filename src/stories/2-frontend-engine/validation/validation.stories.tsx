import { Meta, StoryObj } from "@storybook/react";
import { ValidationStoryComponent } from "./validation-story-component";
import {
	ALL_VALIDATION_DEMO_FIELD_IDS,
	ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
	NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
	OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS,
	STRING_BASED_VALIDATION_DEMO_FIELD_IDS,
	VALIDATION_DEMO_CONFIGS,
} from "./validation.data";

const meta: Meta = {
	title: "Form/Validation Schema",
	component: ValidationStoryComponent,
	argTypes: {
		defaultField: { table: { disable: true } },
		info: { table: { disable: true } },
		fields: { table: { disable: true } },
		type: { table: { disable: true } },
		excludeFields: { table: { disable: true } },
		overrides: { table: { disable: true } },
	},
};
export default meta;

type Story = StoryObj<typeof ValidationStoryComponent>;

export const Email: Story = {
	args: {
		info: {
			rule: { email: true, errorMessage: "Invalid email address" },
			ruleName: "email",
			ruleDescription: "Indicates that the value must be a valid email address.",
		},
		fields: ["maskedField", "textarea", "textField"],
	},
};

export const Empty: Story = {
	args: {
		info: {
			rule: { empty: true, errorMessage: "Must be empty." },
			ruleName: "empty",
			ruleDescription:
				"Indicates that a field must be empty, submitting with non-empty values trigger a validation failure.",
		},
	},
};

export const Equals: Story = {
	args: {
		info: {
			rule: { equals: "apple", errorMessage: "Must be `apple`." },
			ruleName: "equals",
			ruleDescription: "Indicates that a field must be equal to the specified value.",
		},
		excludeFields: OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS,
		overrides: [
			{
				for: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { equals: ["apple"], errorMessage: "Must select Apple only." },
			},
			{
				for: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { equals: 10, errorMessage: "Must be `10`." },
			},
			{
				for: ["contactField"],
				rule: { equals: "+65 91234567", errorMessage: "Must be `9123 4567`." },
			},
			{
				for: ["dateField"],
				rule: { equals: "2024-01-01", errorMessage: "Must be `01/01/2024`." },
			},
			{
				for: ["emailField"],
				rule: { equals: "hello@domain.tld", errorMessage: "Must be `hello@domain.tld`." },
			},
			{
				for: ["switch"],
				rule: { equals: true, errorMessage: "Must select `Yes`." },
			},
			{
				for: ["timeField"],
				rule: { equals: "12:34PM", errorMessage: "Must be `12:34PM`." },
			},
			{
				for: ["unitNumberField"],
				rule: { equals: "01-234", errorMessage: "Must be `#01-234`." },
			},
		],
	},
};

export const EqualsField: Story = {
	args: {
		info: {
			rule: { equalsField: "field2", errorMessage: "Must be equal to field 2." },
			ruleName: "equalsField",
			ruleDescription: "Indicates that a field must be equal to the value of another field.",
		},
		excludeFields: ["esignatureField", "fileUploadField", "imageUpload"],
		overrides: [
			{
				for: ["maskedField", "radio", "select", "textarea", "textField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.textField }, { label: "Field 2" }) },
				defaultValues: { field2: "apple" },
			},
			{
				for: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.numericField }, { label: "Field 2" }) },
				defaultValues: { field2: 10 },
			},
			{
				for: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.checkbox }, { label: "Field 2" }) },
				defaultValues: { field2: ["apple", "berry"] },
			},
			{
				for: ["contactField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.contactField }, { label: "Field 2" }) },
				defaultValues: { field2: "91234567" },
			},
			{
				for: ["dateField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.dateField }, { label: "Field 2" }) },
				defaultValues: { field2: "2024-01-01" },
			},
			{
				for: ["dateRangeField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.dateRangeField }, { label: "Field 2" }) },
				defaultValues: { field2: { from: "2024-01-01", to: "2024-01-15" } },
			},
			{
				for: ["emailField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.emailField }, { label: "Field 2" }) },
				defaultValues: { field2: "default@domain.tld" },
			},
			{
				for: ["histogramSlider"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.histogramSlider }, { label: "Field 2" }) },
				defaultValues: { field2: { from: 10, to: 20 } },
			},
			{
				for: ["locationField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.locationField }, { label: "Field 2" }) },
				defaultValues: {
					field2: {
						address: "1 FUSIONOPOLIS VIEW ECLIPSE SINGAPORE 138577",
						blockNo: "1",
						building: "ECLIPSE",
						lat: 1.299941797074924,
						lng: 103.78940434971592,
						postalCode: "138577",
						roadName: "FUSIONOPOLIS VIEW",
						x: 23112.7395757,
						y: 31366.5202628,
					},
				},
			},
			{
				for: ["nestedMultiSelect"],
				schema: {
					field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.nestedMultiSelect }, { label: "Field 2" }),
				},
				defaultValues: { field2: ["honeydew", "blueberry"] },
			},
			{
				for: ["rangeSelect"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.rangeSelect }, { label: "Field 2" }) },
				defaultValues: { field2: { from: "North", to: "West" } },
			},
			{
				for: ["selectHistogram"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.selectHistogram }, { label: "Field 2" }) },
				defaultValues: { field2: { from: 10, to: 100 } },
			},
			{
				for: ["switch"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.switch }, { label: "Field 2" }) },
				defaultValues: { field2: true },
			},
			{
				for: ["timeField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.timeField }, { label: "Field 2" }) },
				defaultValues: { field2: "12:00PM" },
			},
			{
				for: ["unitNumberField"],
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.unitNumberField }, { label: "Field 2" }) },
				defaultValues: { field2: "01-23" },
			},
		],
	},
};

export const ExcludesArray: Story = {
	name: "Excludes (Array)",
	args: {
		info: {
			rule: { excludes: ["apple", "cherry"], errorMessage: "Must exclude `apple` and `cherry`." },
			ruleName: "excludes",
			ruleDescription:
				"Meant for array-based fields, indicates that the field must exclude all specified values.",
		},
		fields: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "multiSelect",
	},
};

export const ExcludesSingular: Story = {
	name: "Excludes (Singular)",
	args: {
		info: {
			rule: { excludes: "apple", errorMessage: "Must exclude `apple`." },
			ruleName: "excludes",
			ruleDescription: "Meant for array-based fields, indicates that the field must exclude the specified value.",
		},
		fields: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "multiSelect",
	},
};

export const IncludesArray: Story = {
	name: "Includes (Array)",
	args: {
		info: {
			rule: { includes: ["apple", "cherry"], errorMessage: "Must include `apple` and `cherry`." },
			ruleName: "includes",
			ruleDescription:
				"Meant for array-based fields, indicates that the field must include all specified values.",
		},
		fields: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "multiSelect",
	},
};

export const IncludesSingular: Story = {
	name: "Includes (Singular)",
	args: {
		info: {
			rule: { includes: "apple", errorMessage: "Must include `apple`." },
			ruleName: "includes",
			ruleDescription: "Meant for array-based fields, indicates that the field must include the specified value.",
		},
		fields: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "multiSelect",
	},
};

export const Integer: Story = {
	args: {
		info: {
			rule: { integer: true, errorMessage: "Must be integer." },
			ruleName: "integer",
			ruleDescription: "Indicates that the value must be an integer.",
		},
		fields: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "numericField",
	},
};

export const Length: Story = {
	args: {
		info: {
			rule: { length: 2, errorMessage: "Must have exactly 2 characters." },
			ruleName: "length",
			ruleDescription:
				"Dictates that a text-based field value must be of a certain length or a multi-selection field must have exactly the specific number of selected items.",
		},
		fields: [...STRING_BASED_VALIDATION_DEMO_FIELD_IDS, ...ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS],
		excludeFields: ["dateField", "timeField"],
		overrides: [
			{
				for: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { length: 2, errorMessage: "Select exactly 2 items." },
			},
		],
	},
};

export const LessThan: Story = {
	args: {
		info: {
			rule: { lessThan: 5, errorMessage: "Less than 5." },
			ruleName: "lessThan",
			ruleDescription: "Indicates that the value must be less than the specified number.",
		},
		fields: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "numericField",
	},
};

export const Max: Story = {
	args: {
		info: {
			rule: { max: 5, errorMessage: "Max 5 characters allowed." },
			ruleName: "max",
			ruleDescription: `
			<ul>
				<li>For text-based fields, dictates that value can have up to the specified number of characters. Note: Some fields also implement the <code>max-length</code> attribute to prevent entering beyond the specified number of characters.</li>
				<li>For number-based fields, value must not exceed the specified number</li>
				<li>For array-based fields, they can only have up to the specified selected items</li>
			</ul>
		`,
		},
		fields: [
			...STRING_BASED_VALIDATION_DEMO_FIELD_IDS,
			...NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
			...ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
		],
		excludeFields: ["dateField", "timeField"],
		overrides: [
			{
				for: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { max: 5, errorMessage: "Must be less than 5." },
			},
			{
				for: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { max: 2, errorMessage: "Select up to 2 items." },
			},
		],
	},
};

export const Min: Story = {
	args: {
		info: {
			rule: { min: 2, errorMessage: "Must have at least 2 characters." },
			ruleName: "min",
			ruleDescription: `
			<ul>
				<li>For text-based fields, dictates that value must have at least the specified number of characters</li>
				<li>For number-based fields, value must not fall below specified number</li>
				<li>For array-based fields, they must have at least the specified selected items</li>
			</ul>
		`,
		},
		fields: [
			...STRING_BASED_VALIDATION_DEMO_FIELD_IDS,
			...NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
			...ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
		],
		excludeFields: ["dateField", "timeField"],
		overrides: [
			{
				for: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { min: 2, errorMessage: "Must be more than 2." },
			},
			{
				for: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { min: 2, errorMessage: "Select at least 2 items." },
			},
		],
	},
};

export const MoreThan: Story = {
	args: {
		info: {
			rule: { moreThan: 5, errorMessage: "More than 5." },
			ruleName: "moreThan",
			ruleDescription: "Indicates that the value must be more than the specified number.",
		},
		fields: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "numericField",
	},
};

export const Negative: Story = {
	args: {
		info: {
			rule: { negative: true, errorMessage: "Must be less than 0." },
			ruleName: "negative",
			ruleDescription: "Indicates that the value must be less than 0.",
		},
		fields: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "numericField",
	},
};

export const NotEquals: Story = {
	args: {
		info: {
			rule: { notEquals: "apple", errorMessage: "Must not be equal to `apple`" },
			ruleName: "notEquals",
			ruleDescription: "Indicates that a field must not be equal to the specified value.",
		},
		excludeFields: OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS,
		overrides: [
			{
				for: ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { notEquals: ["apple"], errorMessage: "Must not select Apple." },
			},
			{
				for: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
				rule: { notEquals: 10, errorMessage: "Must not be `10`." },
			},
			{
				for: ["contactField"],
				rule: { notEquals: "+65 91234567", errorMessage: "Must not be `9123 4567`." },
			},
			{
				for: ["dateField"],
				rule: { notEquals: "2024-01-01", errorMessage: "Must not be `01/01/2024`." },
			},
			{
				for: ["emailField"],
				rule: { notEquals: "hello@domain.tld", errorMessage: "Must not be `hello@domain.tld`." },
			},
			{
				for: ["switch"],
				rule: { notEquals: true, errorMessage: "Must not select `Yes`." },
			},
			{
				for: ["timeField"],
				rule: { notEquals: "12:34PM", errorMessage: "Must not be `12:34PM`." },
			},
			{
				for: ["unitNumberField"],
				rule: { notEquals: "01-234", errorMessage: "Must not be `#01-234`." },
			},
		],
	},
};

export const Positive: Story = {
	args: {
		info: {
			rule: { positive: true, errorMessage: "Must be more than 0." },
			ruleName: "positive",
			ruleDescription: "Indicates that the value must be more than 0.",
		},
		fields: NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS,
		defaultField: "numericField",
	},
};

export const Regex: Story = {
	args: {
		info: {
			rule: { matches: "/^(hello)/", errorMessage: "Need to begin with `hello`" },
			ruleName: "matches",
			ruleDescription: "Indicates that the value must match the specified regular expression.",
		},
		fields: STRING_BASED_VALIDATION_DEMO_FIELD_IDS,
		overrides: [
			{
				for: ["contactField"],
				rule: { matches: "/^\\+65 9123/", errorMessage: "Must begin with 9123." },
			},
			{
				for: ["dateField"],
				rule: { matches: "/^\\d{4}\\-(01)\\-\\d{2}/", errorMessage: "Must be in January." },
			},
			{
				for: ["radio", "select"],
				rule: { matches: "/r/gi", errorMessage: "Selection must contain `r`." },
			},
			{
				for: ["timeField"],
				rule: { matches: "/^12/", errorMessage: "Must be at 12." },
			},
			{
				for: ["unitNumberField"],
				rule: { matches: "/^01/", errorMessage: "Must be at 1st floor." },
			},
		],
	},
};

export const Required: Story = {
	args: {
		info: {
			rule: { required: true, errorMessage: "Field is required." },
			ruleName: "required",
			ruleDescription:
				"Indicates that a field is mandatory, submitting with empty values trigger a validation failure.",
		},
	},
};

export const SoftValidation: Story = {
	args: {
		info: {
			rule: { required: true, errorMessage: "Field is required.", soft: true },
			ruleName: "soft",
			ruleDescription:
				"Shows a warning alert instead of an error alert when validation fails. The form can still be submitted.",
		},
	},
};

export const Uinfin: Story = {
	args: {
		info: {
			rule: { uinfin: true, errorMessage: "Invalid NRIC/FIN" },
			ruleName: "uinfin",
			ruleDescription: "Indicates that the value must be a valid NRIC/FIN.",
		},
		fields: ["maskedField", "textarea", "textField"],
	},
};

export const Url: Story = {
	args: {
		info: {
			rule: { url: true, errorMessage: "Invalid url" },
			ruleName: "url",
			ruleDescription: "Indicates that the value must be a valid url.",
		},
		fields: ["maskedField", "textarea", "textField"],
	},
};

export const Uuid: Story = {
	args: {
		info: {
			rule: { uuid: true, errorMessage: "Invalid uuid" },
			ruleName: "uuid",
			ruleDescription: "Indicates that the value must be a valid uuid.",
		},
		fields: ["maskedField", "textarea", "textField"],
	},
};

export const WhenExact: Story = {
	name: "Conditional (Exact value)",
	args: {
		info: {
			rule: {
				when: {
					field2: {
						is: "something",
						then: [{ required: true, errorMessage: "Required when field 2 value is `something`." }],
						otherwise: [
							{ empty: true, errorMessage: "Must not be filled when field 2 value is not `something`." },
						],
					},
				},
			},
			ruleName: "when",
			ruleDescription:
				"Applies validation to a field when another field is equal/not equal to a specific value according to the <code>is</code> value.",
		},
		excludeFields: OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS,
		overrides: [
			{
				for: ALL_VALIDATION_DEMO_FIELD_IDS,
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.textField }, { label: "Field 2" }) },
			},
		],
	},
};

export const WhenSchema: Story = {
	name: "Conditional (Schema-based)",
	args: {
		info: {
			rule: {
				when: {
					field2: {
						is: [{ filled: true }, { min: 3 }],
						then: [{ required: true, errorMessage: "Required when field 2 value is `something`." }],
						otherwise: [
							{ empty: true, errorMessage: "Must not be filled when field 2 value is not `something`." },
						],
					},
				},
			},
			ruleName: "when",
			ruleDescription:
				"Applies validation to a field when another field fulfils / fails the validation schema according to the <code>is</code> value. Aside from validation rules, the <code>is</code> key also accepts conditional validation rules like the `filled`.",
		},
		excludeFields: OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS,
		overrides: [
			{
				for: ALL_VALIDATION_DEMO_FIELD_IDS,
				schema: { field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.textField }, { label: "Field 2" }) },
			},
		],
	},
};

export const WhenSchemaNested: Story = {
	name: "Conditional (Nested rule)",
	args: {
		info: {
			rule: {
				when: {
					field2: {
						is: [{ filled: true }],
						then: [
							{
								when: {
									field3: {
										is: [{ filled: true }],
										then: [
											{
												required: true,
												errorMessage: "Field 1 is required if field 2 and 3 are filled.",
											},
										],
									},
								},
							},
						],
					},
				},
			},
			ruleName: "when",
			ruleDescription:
				"Validation rules can be nested to apply more complex conditions. In this example, field 1 is required when field 2 and 3 are filled.",
		},
		excludeFields: OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS,
		overrides: [
			{
				for: ALL_VALIDATION_DEMO_FIELD_IDS,
				schema: {
					field2: Object.assign({ ...VALIDATION_DEMO_CONFIGS.textField }, { label: "Field 2" }),
					field3: Object.assign({ ...VALIDATION_DEMO_CONFIGS.textField }, { label: "Field 3" }),
				},
			},
		],
	},
};
