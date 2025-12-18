import isEqual from "lodash/isEqual";
import * as Yup from "yup";
import { SchemaDescription } from "yup/lib/schema";
import { IYupValidationRule, TYupSchemaType, YupHelper } from "../../../../context-providers";
import { TestHelper } from "../../../../utils";

const ERROR_MESSAGE = "test error message";
const ERROR_MESSAGE_2 = "test error message 2";
const ERROR_MESSAGE_3 = "test error message 3";

describe("YupHelper", () => {
	describe("buildSchema", () => {
		beforeEach(() => {
			jest.spyOn(console, "warn").mockImplementation();
		});
		afterEach(() => {
			jest.restoreAllMocks();
		});

		it("should create Yup schema based on config provided", () => {
			const values = {
				field1: undefined,
				field2: 1,
			};
			const schema = YupHelper.buildSchema({
				field1: {
					schema: Yup.string(),
					validationRules: [
						{ required: true, errorMessage: ERROR_MESSAGE },
						{ min: 1, errorMessage: ERROR_MESSAGE_2 },
					],
				},
				field2: { schema: Yup.number(), validationRules: [{ min: 2, errorMessage: ERROR_MESSAGE_3 }] },
			});
			const schemaFields = schema.describe().fields;
			const schemaTypeList = Object.keys(schemaFields).map((key) => schemaFields[key].type);
			const schemaTestList = Object.keys(schemaFields).map(
				(key) => (schemaFields[key] as SchemaDescription).tests
			);

			expect(schemaTypeList).toEqual(["string", "number"]);
			expect(
				isEqual(schemaTestList, [
					[
						{ name: "required", params: undefined },
						{ name: "min", params: { min: 1 } },
					],
					[{ name: "min", params: { min: 2 } }],
				])
			).toBe(true);

			const error = TestHelper.getError(() => schema.validateSync(values, { abortEarly: false }));
			expect(error.inner).toHaveLength(2);
			expect(error.inner[0].message).toBe(ERROR_MESSAGE);
			expect(error.inner[1].message).toBe(ERROR_MESSAGE_3);
		});

		it("should be able to create a schema without cyclic dependency", () => {
			const schema = YupHelper.buildSchema({
				field1: {
					schema: Yup.string(),
					validationRules: [
						{
							when: {
								field2: {
									is: [{ empty: true }],
									then: [{ required: true, errorMessage: ERROR_MESSAGE }],
								},
							},
						},
					],
				},
				field2: {
					schema: Yup.string(),
					validationRules: [
						{
							when: {
								field1: {
									is: [{ empty: true }],
									then: [{ required: true, errorMessage: ERROR_MESSAGE_2 }],
								},
							},
						},
					],
				},
			});

			const error = TestHelper.getError(() => schema.validateSync(undefined, { abortEarly: false }));
			expect(error.inner).toHaveLength(2);
			expect(error.inner[0].message).toBe(ERROR_MESSAGE);
			expect(error.inner[1].message).toBe(ERROR_MESSAGE_2);
			expect(() => schema.validateSync({ field1: "hello" })).not.toThrow();
		});

		it("should log warn and skip when condition if dependent field does not exist", () => {
			const schema = YupHelper.buildSchema({
				field1: {
					schema: Yup.string(),
					validationRules: [
						{
							when: {
								nonExistentField: {
									is: [{ empty: true }],
									then: [{ required: true, errorMessage: ERROR_MESSAGE }],
								},
							},
						},
					],
				},
			});

			expect(console.warn).toHaveBeenCalledWith(
				'field "nonExistentField" was not found, when condition on "field1" was not applied'
			);
			expect(() => schema.validateSync({ field1: undefined })).not.toThrow();
		});
	});

	describe("buildFieldSchema", () => {
		it("should create a Yup schema for a field based on config provided", () => {
			const fieldSchema = YupHelper.buildFieldSchema(Yup.string(), [
				{ required: true, errorMessage: ERROR_MESSAGE },
				{ min: 1, errorMessage: ERROR_MESSAGE_2 },
			]);
			const fieldSchemaDescription = fieldSchema.describe();

			expect(fieldSchemaDescription.type).toBe("string");
			expect(
				isEqual(fieldSchemaDescription.tests, [
					{ name: "required", params: undefined },
					{ name: "min", params: { min: 1 } },
				])
			).toBe(true);

			const error = TestHelper.getError(() => fieldSchema.validateSync(undefined, { abortEarly: false }));
			expect(error.inner).toHaveLength(1);
			expect(error.inner[0].message).toBe(ERROR_MESSAGE);
		});

		it("should ignore invalid rules", () => {
			const fieldSchema = YupHelper.buildFieldSchema(Yup.string(), [
				{ required: true, errorMessage: ERROR_MESSAGE },
				{ min: 1, errorMessage: ERROR_MESSAGE_2 },
				{ myCustomRule: true, errorMessage: ERROR_MESSAGE } as IYupValidationRule,
			]);
			const fieldSchemaDescription = fieldSchema.describe();

			expect(fieldSchemaDescription.type).toBe("string");
			expect(
				isEqual(fieldSchemaDescription.tests, [
					{ name: "required", params: undefined },
					{ name: "min", params: { min: 1 } },
				])
			).toBe(true);

			const error = TestHelper.getError(() => fieldSchema.validateSync(undefined, { abortEarly: false }));
			expect(error.inner).toHaveLength(1);
			expect(error.inner[0].message).toBe(ERROR_MESSAGE);
		});
	});

	describe("mapSchemaType", () => {
		it.each<TYupSchemaType>(["string", "number", "boolean", "array", "object"])(
			"should initialise Yup %s type",
			(type) => {
				const schema = YupHelper.mapSchemaType(type);
				const description = schema.describe();
				expect(description.type).toBe(type);
			}
		);

		it("should initialise Yup mixed type for other types", () => {
			const schema = YupHelper.mapSchemaType("something" as TYupSchemaType);
			const description = schema.describe();
			expect(description.type).toBe("mixed");
		});
	});

	describe("mapRules", () => {
		it.each`
			type         | condition              | config                              | valid                                     | invalid
			${"string"}  | ${"required"}          | ${{ required: true }}               | ${"hello"}                                | ${undefined}
			${"string"}  | ${"email"}             | ${{ email: true }}                  | ${"john@doe.tld"}                         | ${"hello"}
			${"string"}  | ${"url"}               | ${{ url: true }}                    | ${"https://www.domain.tld"}               | ${"hello"}
			${"string"}  | ${"uuid"}              | ${{ uuid: true }}                   | ${"e9949c11-51b6-4c44-9070-623dfb2ca01a"} | ${"hello"}
			${"string"}  | ${"uinfin"}            | ${{ uinfin: true }}                 | ${"S1234567D"}                            | ${"S1234567A"}
			${"string"}  | ${"matches"}           | ${{ matches: "/^(hello)/" }}        | ${"hello world"}                          | ${"hi there"}
			${"string"}  | ${"notMatches"}        | ${{ notMatches: "/^(hello)/" }}     | ${"hi there"}                             | ${"hello world"}
			${"string"}  | ${"noWhitespaceOnly"}  | ${{ noWhitespaceOnly: true }}       | ${"  .  "}                                | ${"      "}
			${"string"}  | ${"length"}            | ${{ length: 1 }}                    | ${"h"}                                    | ${"hi"}
			${"string"}  | ${"min"}               | ${{ min: 2 }}                       | ${"he"}                                   | ${"h"}
			${"string"}  | ${"max"}               | ${{ max: 1 }}                       | ${"h"}                                    | ${"hi"}
			${"string"}  | ${"filled"}            | ${{ filled: true }}                 | ${"hello"}                                | ${undefined}
			${"string"}  | ${"empty (undefined"}  | ${{ empty: true }}                  | ${undefined}                              | ${"hello"}
			${"string"}  | ${"empty (string)"}    | ${{ empty: true }}                  | ${""}                                     | ${"hello"}
			${"string"}  | ${"equals"}            | ${{ equals: "hello" }}              | ${"hello"}                                | ${"hi"}
			${"string"}  | ${"equals"}            | ${{ equals: "hello" }}              | ${"hello"}                                | ${undefined}
			${"string"}  | ${"equals"}            | ${{ equals: "hello" }}              | ${"hello"}                                | ${"hi"}
			${"string"}  | ${"notEquals"}         | ${{ notEquals: "hello" }}           | ${"hi"}                                   | ${"hello"}
			${"number"}  | ${"required"}          | ${{ required: true }}               | ${1}                                      | ${undefined}
			${"number"}  | ${"min"}               | ${{ min: 0 }}                       | ${0}                                      | ${-1}
			${"number"}  | ${"max"}               | ${{ max: 0 }}                       | ${0}                                      | ${1}
			${"number"}  | ${"filled"}            | ${{ filled: true }}                 | ${1}                                      | ${undefined}
			${"number"}  | ${"empty"}             | ${{ empty: true }}                  | ${undefined}                              | ${1}
			${"number"}  | ${"equals"}            | ${{ equals: 1 }}                    | ${1}                                      | ${2}
			${"number"}  | ${"notEquals"}         | ${{ notEquals: 1 }}                 | ${2}                                      | ${1}
			${"number"}  | ${"lessThan"}          | ${{ lessThan: 0 }}                  | ${-1}                                     | ${0}
			${"number"}  | ${"lessThan"}          | ${{ lessThan: 1 }}                  | ${0.9}                                    | ${1.1}
			${"number"}  | ${"moreThan"}          | ${{ moreThan: 0 }}                  | ${1}                                      | ${0}
			${"number"}  | ${"moreThan"}          | ${{ moreThan: 1 }}                  | ${1.1}                                    | ${0.9}
			${"number"}  | ${"positive"}          | ${{ positive: true }}               | ${1}                                      | ${-1}
			${"number"}  | ${"negative"}          | ${{ negative: true }}               | ${-1}                                     | ${1}
			${"number"}  | ${"integer"}           | ${{ integer: true }}                | ${1}                                      | ${1.1}
			${"array"}   | ${"required"}          | ${{ required: true }}               | ${["hello"]}                              | ${undefined}
			${"array"}   | ${"filled"}            | ${{ filled: true }}                 | ${["hello"]}                              | ${[]}
			${"array"}   | ${"empty"}             | ${{ empty: true }}                  | ${[]}                                     | ${["hello"]}
			${"array"}   | ${"empty (undefined)"} | ${{ empty: true }}                  | ${[]}                                     | ${["hello"]}
			${"array"}   | ${"equals"}            | ${{ equals: ["hello"] }}            | ${["hello"]}                              | ${["hi"]}
			${"array"}   | ${"notEquals"}         | ${{ notEquals: ["hello"] }}         | ${["hi"]}                                 | ${["hello"]}
			${"array"}   | ${"length"}            | ${{ length: 1 }}                    | ${["hello"]}                              | ${["hello", "world"]}
			${"array"}   | ${"min"}               | ${{ min: 2 }}                       | ${["hello", "world"]}                     | ${["hello"]}
			${"array"}   | ${"max"}               | ${{ max: 1 }}                       | ${["hello"]}                              | ${["hello", "world"]}
			${"array"}   | ${"includes string"}   | ${{ includes: "hello" }}            | ${["hello"]}                              | ${["hi"]}
			${"array"}   | ${"excludes string"}   | ${{ excludes: "hello" }}            | ${["hi"]}                                 | ${["hello"]}
			${"array"}   | ${"includes array"}    | ${{ includes: ["hello", "world"] }} | ${["hello", "world"]}                     | ${["hi"]}
			${"array"}   | ${"excludes array"}    | ${{ excludes: ["hello", "world"] }} | ${["hi"]}                                 | ${["hello", "hi", "world"]}
			${"boolean"} | ${"equals"}            | ${{ equals: true }}                 | ${true}                                   | ${undefined}
			${"mixed"}   | ${"equals"}            | ${{ equals: true }}                 | ${true}                                   | ${"true"}
			${"mixed"}   | ${"equals"}            | ${{ equals: 1 }}                    | ${1}                                      | ${null}
			${"mixed"}   | ${"equals"}            | ${{ equals: 1 }}                    | ${1}                                      | ${undefined}
		`("should support $condition condition for Yup $type type", ({ type, config, valid, invalid }) => {
			const schema = YupHelper.mapRules(YupHelper.mapSchemaType(type), [
				{ ...config, errorMessage: ERROR_MESSAGE },
			]);
			expect(() => schema.validateSync(valid)).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync(invalid, { abortEarly: false }))?.message).toBe(
				ERROR_MESSAGE
			);
		});

		const generateMultipleFieldSchema = (type: "string" | "number" | "boolean" | "object" | "array") =>
			YupHelper.buildSchema({
				field1: { schema: YupHelper.mapSchemaType(type), validationRules: [] },
				field2: {
					schema: YupHelper.mapSchemaType(type),
					validationRules: [{ equalsField: "field1", errorMessage: ERROR_MESSAGE }],
				},
			});

		it.each`
			type         | condition        | valid                   | invalid
			${"string"}  | ${"equalsField"} | ${"hello"}              | ${"help"}
			${"number"}  | ${"equalsField"} | ${1}                    | ${2}
			${"boolean"} | ${"equalsField"} | ${true}                 | ${false}
			${"array"}   | ${"equalsField"} | ${["Apple"]}            | ${["Apple", "Berry"]}
			${"object"}  | ${"equalsField"} | ${{ fruit: ["Apple"] }} | ${{}}
		`("should support $condition condition for Yup $type type", ({ type, valid, invalid }) => {
			const schema = generateMultipleFieldSchema(type);

			expect(() => schema.validateSync({ field1: valid, field2: valid })).not.toThrowError();
			expect(
				TestHelper.getError(() =>
					schema.validateSync({ field1: valid, field2: invalid }, { abortEarly: false })
				).message
			).toBe(ERROR_MESSAGE);
		});

		it.each`
			type         | condition           | value                   | valid                   | invalid
			${"string"}  | ${"notEqualsField"} | ${"hello"}              | ${"bye"}                | ${"hello"}
			${"number"}  | ${"notEqualsField"} | ${0}                    | ${1}                    | ${0}
			${"boolean"} | ${"notEqualsField"} | ${false}                | ${true}                 | ${false}
			${"array"}   | ${"notEqualsField"} | ${["Berry", "Apple"]}   | ${["Apple"]}            | ${["Apple", "Berry"]}
			${"object"}  | ${"notEqualsField"} | ${{ fruit: ["Berry"] }} | ${{ fruit: ["Apple"] }} | ${{ fruit: ["Berry"] }}
		`("should support $condition condition for Yup $type type", ({ type, value, valid, invalid }) => {
			const schema = YupHelper.buildSchema({
				field1: { schema: YupHelper.mapSchemaType(type), validationRules: [] },
				field2: {
					schema: YupHelper.mapSchemaType(type),
					validationRules: [{ notEqualsField: "field1", errorMessage: ERROR_MESSAGE }],
				},
			});

			expect(() => schema.validateSync({ field1: value, field2: valid })).not.toThrowError();
			expect(
				TestHelper.getError(() =>
					schema.validateSync({ field1: value, field2: invalid }, { abortEarly: false })
				).message
			).toBe(ERROR_MESSAGE);
		});

		const generateConditionalSchema = (type: TYupSchemaType, is: any, sourceFieldType: TYupSchemaType) =>
			Yup.object().shape({
				field1: YupHelper.mapRules(YupHelper.mapSchemaType(type), [
					{
						when: {
							field2: {
								is,
								then: [{ required: true, errorMessage: ERROR_MESSAGE }],
								otherwise: [{ min: 5, errorMessage: ERROR_MESSAGE_2 }],
								yupSchema: YupHelper.mapSchemaType(sourceFieldType),
							},
						},
					},
				]),
			});

		it("should support conditional validation for Yup string type", () => {
			const schema = generateConditionalSchema("string", "hello", "string");

			expect(() => schema.validateSync({ field1: "hi", field2: "hello" })).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: "hello" })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: "hi", field2: "world" })).message).toBe(
				ERROR_MESSAGE_2
			);
		});

		it("should support conditional validation for Yup number type", () => {
			const schema = generateConditionalSchema("number", 1, "number");

			expect(() => schema.validateSync({ field1: 5, field2: 1 })).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: 1 })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: 4, field2: 2 })).message).toBe(
				ERROR_MESSAGE_2
			);
		});

		it.each`
			uiType      | sourceFieldType | valid                                     | then                                        | otherwise
			${"string"} | ${"string"}     | ${{ field1: "hello", field2: "world" }}   | ${{ field1: undefined, field2: "world" }}   | ${{ field1: "hi", field2: "hi" }}
			${"number"} | ${"string"}     | ${{ field1: 1, field2: "world" }}         | ${{ field1: undefined, field2: "world" }}   | ${{ field1: 2, field2: "hi" }}
			${"array"}  | ${"string"}     | ${{ field1: [1], field2: "world" }}       | ${{ field1: undefined, field2: "world" }}   | ${{ field1: [1, 2], field2: "hi" }}
			${"string"} | ${"number"}     | ${{ field1: "hello", field2: 3 }}         | ${{ field1: undefined, field2: 3 }}         | ${{ field1: "hi", field2: 2 }}
			${"number"} | ${"number"}     | ${{ field1: 1, field2: 3 }}               | ${{ field1: undefined, field2: 3 }}         | ${{ field1: 3, field2: 2 }}
			${"array"}  | ${"number"}     | ${{ field1: [1], field2: 3 }}             | ${{ field1: undefined, field2: 3 }}         | ${{ field1: [1, 2], field2: 2 }}
			${"string"} | ${"array"}      | ${{ field1: "hello", field2: [1, 2, 3] }} | ${{ field1: undefined, field2: [1, 2, 3] }} | ${{ field1: "hi", field2: [1] }}
			${"number"} | ${"array"}      | ${{ field1: 1, field2: [1, 2, 3] }}       | ${{ field1: undefined, field2: [1, 2, 3] }} | ${{ field1: [1], field2: [1] }}
			${"array"}  | ${"array"}      | ${{ field1: [1], field2: [1, 2, 3] }}     | ${{ field1: undefined, field2: [1, 2, 3] }} | ${{ field1: [1, 2, 3], field2: [1] }}
		`(
			"should support Yup $uiType conditional validation with config as condition for Yup $sourceFieldType type",
			({ uiType, sourceFieldType, valid, then, otherwise }) => {
				const schema = generateConditionalSchema(uiType, [{ filled: true }, { min: 3 }], sourceFieldType);

				expect(() => schema.validateSync(valid)).not.toThrowError();
				expect(TestHelper.getError(() => schema.validateSync(then)).message).toBe(ERROR_MESSAGE);
				expect(TestHelper.getError(() => schema.validateSync(otherwise)).message).toBe(ERROR_MESSAGE_2);
			}
		);

		it.each`
			scenario           | type        | value
			${"empty strings"} | ${"string"} | ${""}
			${"null values"}   | ${"string"} | ${null}
			${"empty array"}   | ${"array"}  | ${[]}
			${"empty object"}  | ${"object"} | ${{}}
		`("should skip non-required validation rules for $scenario", ({ type, value }) => {
			const schema = YupHelper.mapRules(YupHelper.mapSchemaType(type), [{ min: 5, errorMessage: ERROR_MESSAGE }]);
			expect(() => schema.validateSync(value)).not.toThrowError();
		});

		it("should run non conditional validation rules regardless whether conditional validation is fulfilled or not", () => {
			const schema = Yup.object().shape({
				field1: YupHelper.mapRules(YupHelper.mapSchemaType("string"), [
					{ min: 5, errorMessage: ERROR_MESSAGE },
					{
						when: {
							field2: {
								is: [{ filled: true }],
								then: [{ max: 15, errorMessage: ERROR_MESSAGE_2 }],
								otherwise: [{ max: 10, errorMessage: ERROR_MESSAGE_3 }],
								yupSchema: YupHelper.mapSchemaType("string"),
							},
						},
					},
				]),
			});

			expect(TestHelper.getError(() => schema.validateSync({ field1: "hi", field2: "hi" })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: "hi", field2: undefined })).message).toBe(
				ERROR_MESSAGE
			);
		});

		it("should be able to support nested conditional validation", () => {
			const schema = Yup.object().shape({
				field1: YupHelper.mapRules(YupHelper.mapSchemaType("string"), [
					{
						when: {
							field2: {
								is: [{ filled: true }],
								then: [
									{
										when: {
											field3: {
												is: [{ filled: true }],
												then: [{ required: true, errorMessage: ERROR_MESSAGE }],
												yupSchema: YupHelper.mapSchemaType("string"),
											},
										},
									},
								],
								yupSchema: YupHelper.mapSchemaType("string"),
							},
						},
					},
				]),
			});

			expect(() => schema.validateSync({ field1: "a", field2: "b", field3: "c" })).not.toThrow();
			expect(() => schema.validateSync({ field1: undefined, field2: undefined, field3: "c" })).not.toThrow();
			expect(() => schema.validateSync({ field1: undefined, field2: "b", field3: undefined })).not.toThrow();
			expect(
				TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: "b", field3: "c" })).message
			).toBe(ERROR_MESSAGE);
		});

		it("should only apply rules if available on the schema", () => {
			const schema = YupHelper.mapRules(Yup.mixed(), [
				{ filled: true, errorMessage: ERROR_MESSAGE },
				{ matches: "/hello/", errorMessage: ERROR_MESSAGE_2 },
				{ notMatches: "/hello/", errorMessage: ERROR_MESSAGE_3 },
			]);
			expect(TestHelper.getError(() => schema.validateSync(null))?.message).toBe(ERROR_MESSAGE);
		});
	});

	describe("addCondition", () => {
		it("should be able to add condition for Yup string type", () => {
			YupHelper.addCondition("string", "testString", (value) => value === "hello");
			const schema = (Yup.string() as any).testString(undefined, ERROR_MESSAGE);

			expect(() => schema.validateSync("hello")).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync("hi")).message).toBe(ERROR_MESSAGE);
		});

		it("should be able to add condition for Yup number type", () => {
			YupHelper.addCondition("number", "testNumber", (value) => value === 123);
			const schema = (Yup.number() as any).testNumber(undefined, ERROR_MESSAGE);

			expect(() => schema.validateSync(123)).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync(321)).message).toBe(ERROR_MESSAGE);
		});

		it("should be able to add condition for Yup array type", () => {
			YupHelper.addCondition("array", "testArray", (value) => isEqual(value, [1, 2, 3]));
			const schema = (Yup.array() as any).testArray(undefined, ERROR_MESSAGE);

			expect(() => schema.validateSync([1, 2, 3])).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync([3, 2, 1])).message).toBe(ERROR_MESSAGE);
		});
	});
});
