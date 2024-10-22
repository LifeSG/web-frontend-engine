import { TFrontendEngineFieldSchema } from "../../../components";
export const VALIDATION_DEMO_CONFIGS: Record<string, TFrontendEngineFieldSchema> = {
	checkbox: {
		uiType: "checkbox",
		label: "Checkbox",
		customOptions: {
			styleType: "toggle",
		},
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
	},
	chips: {
		uiType: "chips",
		label: "Chips",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
	},
	contactField: {
		uiType: "contact-field",
		label: "Contact number field",
	},
	dateField: {
		uiType: "date-field",
		label: "Date field",
	},
	dateRangeField: {
		uiType: "date-range-field",
		label: "Date range field",
		variant: "range",
	},
	emailField: {
		uiType: "email-field",
		label: "Email field",
	},
	esignatureField: {
		label: "E-signature field",
		uiType: "e-signature-field",
		upload: {
			type: "base64",
			url: "https://jsonplaceholder.typicode.com/posts",
		},
	},
	fileUploadField: {
		label: "File upload",
		uiType: "file-upload",
		uploadOnAddingFile: {
			type: "base64",
			url: "https://jsonplaceholder.typicode.com/posts",
		},
	},
	histogramSlider: {
		uiType: "histogram-slider",
		label: "Histogram slider",
		bins: [
			{ minValue: 0, count: 0 },
			{ minValue: 10, count: 2 },
			{ minValue: 20, count: 3 },
			{ minValue: 90, count: 8 },
		],
		interval: 10,
	},
	imageUpload: {
		label: "Image upload",
		uiType: "image-upload",
	},
	locationField: {
		uiType: "location-field",
		label: "Location field",
	},
	maskedField: {
		label: "Masked field",
		uiType: "masked-field",
		maskRange: [2, 5],
	},
	multiSelect: {
		uiType: "multi-select",
		label: "Multi select",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
	},
	nestedMultiSelect: {
		uiType: "nested-multi-select",
		label: "Nested multi select",
		options: [
			{
				label: "Fruits",
				key: "fruits-key",
				subItems: [
					{ label: "Apple", value: "apple", key: "apple-key" },
					{
						label: "Berries",
						key: "berries-key",
						subItems: [
							{ label: "Blueberry", value: "blueberry", key: "blueberry-key" },
							{ label: "Raspberry", value: "raspberry", key: "raspberry-key" },
						],
					},
					{
						label: "Melons",
						key: "melons-key",
						subItems: [
							{ label: "Watermelon", value: "watermelon", key: "watermelon-key" },
							{ label: "Honeydew", value: "honeydew", key: "honeydew-key" },
						],
					},
				],
			},
		],
	},
	numericField: {
		uiType: "numeric-field",
		label: "Numeric field",
	},
	radio: {
		uiType: "radio",
		label: "Radio Button",
		customOptions: {
			styleType: "toggle",
		},
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
	},
	rangeSelect: {
		uiType: "range-select",
		label: "Range select",
		options: {
			from: [
				{ label: "North", value: "North" },
				{ label: "East", value: "East" },
			],
			to: [
				{ label: "South", value: "South" },
				{ label: "West", value: "West" },
			],
		},
	},
	select: {
		uiType: "select",
		label: "Select",
		options: [
			{ label: "Apple", value: "apple" },
			{ label: "Berry", value: "berry" },
			{ label: "Cherry", value: "cherry" },
		],
	},
	selectHistogram: {
		uiType: "select-histogram",
		label: "Select histogram",
		histogramSlider: {
			bins: [
				{ minValue: 0, count: 0 },
				{ minValue: 10, count: 35 },
				{ minValue: 50, count: 20 },
				{ minValue: 90, count: 50 },
			],
			interval: 10,
		},
	},
	slider: {
		uiType: "slider",
		label: "Slider",
		customOptions: {
			showSliderLabels: true,
			showIndicatorLabel: true,
		},
	},
	switch: {
		uiType: "switch",
		label: "Switch",
	},
	textarea: {
		uiType: "textarea",
		label: "Textarea",
	},
	textField: {
		uiType: "text-field",
		label: "Text field",
	},
	timeField: {
		label: "Time field",
		uiType: "time-field",
	},
	unitNumberField: {
		label: "Unit number field",
		uiType: "unit-number-field",
	},
};

export type TValidationDemoFieldIds = keyof typeof VALIDATION_DEMO_CONFIGS;
export const ALL_VALIDATION_DEMO_FIELD_IDS: TValidationDemoFieldIds[] = Object.keys(
	VALIDATION_DEMO_CONFIGS
) as TValidationDemoFieldIds[];
export const STRING_BASED_VALIDATION_DEMO_FIELD_IDS: TValidationDemoFieldIds[] = [
	"contactField",
	"dateField",
	"emailField",
	"maskedField",
	"radio",
	"select",
	"textarea",
	"textField",
	"timeField",
	"unitNumberField",
];
export const ARRAY_BASED_VALIDATION_DEMO_FIELD_IDS: TValidationDemoFieldIds[] = ["checkbox", "chips", "multiSelect"];
export const NUMERIC_BASED_VALIDATION_DEMO_FIELD_IDS: TValidationDemoFieldIds[] = ["numericField", "slider"];
export const OBJECT_BASED_VALIDATION_DEMO_FIELD_IDS: TValidationDemoFieldIds[] = [
	"dateRangeField",
	"esignatureField",
	"fileUploadField",
	"histogramSlider",
	"imageUpload",
	"locationField",
	"nestedMultiSelect",
	"rangeSelect",
	"selectHistogram",
];
