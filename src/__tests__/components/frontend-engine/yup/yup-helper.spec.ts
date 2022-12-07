import isEqual from "lodash/isEqual";
import * as Yup from "yup";
import { SchemaDescription } from "yup/lib/schema";
import { IYupValidationRule, TYupSchemaType, YupHelper } from "../../../../components/frontend-engine/yup";
import { TestHelper } from "../../../../utils";

const ERROR_MESSAGE = "test error message";
const ERROR_MESSAGE_2 = "test error message 2";
const ERROR_MESSAGE_3 = "test error message 3";

describe("YupHelper", () => {
	describe("buildSchema", () => {
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
			type        | condition            | config                              | valid                                     | invalid
			${"string"} | ${"required"}        | ${{ required: true }}               | ${"hello"}                                | ${undefined}
			${"string"} | ${"email"}           | ${{ email: true }}                  | ${"john@doe.tld"}                         | ${"hello"}
			${"string"} | ${"url"}             | ${{ url: true }}                    | ${"https://www.domain.tld"}               | ${"hello"}
			${"string"} | ${"uuid"}            | ${{ uuid: true }}                   | ${"e9949c11-51b6-4c44-9070-623dfb2ca01a"} | ${"hello"}
			${"string"} | ${"uinfin"}          | ${{ uinfin: true }}                 | ${"S1234567D"}                            | ${"S1234567A"}
			${"string"} | ${"matches"}         | ${{ matches: "/^(hello)/" }}        | ${"hello world"}                          | ${"hi there"}
			${"string"} | ${"length"}          | ${{ length: 1 }}                    | ${"h"}                                    | ${"hi"}
			${"string"} | ${"min"}             | ${{ min: 1 }}                       | ${"h"}                                    | ${""}
			${"string"} | ${"max"}             | ${{ max: 1 }}                       | ${"h"}                                    | ${"hi"}
			${"string"} | ${"filled"}          | ${{ filled: true }}                 | ${"hello"}                                | ${undefined}
			${"string"} | ${"empty"}           | ${{ empty: true }}                  | ${undefined}                              | ${"hello"}
			${"string"} | ${"equals"}          | ${{ equals: "hello" }}              | ${"hello"}                                | ${"hi"}
			${"string"} | ${"notEquals"}       | ${{ notEquals: "hello" }}           | ${"hi"}                                   | ${"hello"}
			${"number"} | ${"required"}        | ${{ required: true }}               | ${1}                                      | ${undefined}
			${"number"} | ${"min"}             | ${{ min: 1 }}                       | ${1}                                      | ${0}
			${"number"} | ${"max"}             | ${{ max: 1 }}                       | ${1}                                      | ${2}
			${"number"} | ${"filled"}          | ${{ filled: true }}                 | ${1}                                      | ${undefined}
			${"number"} | ${"empty"}           | ${{ empty: true }}                  | ${undefined}                              | ${1}
			${"number"} | ${"equals"}          | ${{ equals: 1 }}                    | ${1}                                      | ${2}
			${"number"} | ${"notEquals"}       | ${{ notEquals: 1 }}                 | ${2}                                      | ${1}
			${"number"} | ${"lessThan"}        | ${{ lessThan: 1 }}                  | ${0}                                      | ${1}
			${"number"} | ${"moreThan"}        | ${{ moreThan: 1 }}                  | ${2}                                      | ${1}
			${"number"} | ${"positive"}        | ${{ positive: true }}               | ${1}                                      | ${-1}
			${"number"} | ${"negative"}        | ${{ negative: true }}               | ${-1}                                     | ${1}
			${"number"} | ${"integer"}         | ${{ integer: true }}                | ${1}                                      | ${1.1}
			${"array"}  | ${"required"}        | ${{ required: true }}               | ${["hello"]}                              | ${undefined}
			${"array"}  | ${"filled"}          | ${{ filled: true }}                 | ${["hello"]}                              | ${[]}
			${"array"}  | ${"empty"}           | ${{ empty: true }}                  | ${[]}                                     | ${["hello"]}
			${"array"}  | ${"equals"}          | ${{ equals: ["hello"] }}            | ${["hello"]}                              | ${["hi"]}
			${"array"}  | ${"notEquals"}       | ${{ notEquals: ["hello"] }}         | ${["hi"]}                                 | ${["hello"]}
			${"array"}  | ${"length"}          | ${{ length: 1 }}                    | ${["hello"]}                              | ${["hello", "world"]}
			${"array"}  | ${"min"}             | ${{ min: 1 }}                       | ${["hello"]}                              | ${[]}
			${"array"}  | ${"max"}             | ${{ max: 1 }}                       | ${["hello"]}                              | ${["hello", "world"]}
			${"array"}  | ${"includes string"} | ${{ includes: "hello" }}            | ${["hello"]}                              | ${["hi"]}
			${"array"}  | ${"excludes string"} | ${{ excludes: "hello" }}            | ${["hi"]}                                 | ${["hello"]}
			${"array"}  | ${"includes array"}  | ${{ includes: ["hello", "world"] }} | ${["hello", "world"]}                     | ${["hi"]}
			${"array"}  | ${"excludes array"}  | ${{ excludes: ["hello", "world"] }} | ${["hi"]}                                 | ${["hello", "hi", "world"]}
		`("should support $condition condition for Yup $type type", ({ type, config, valid, invalid }) => {
			const schema = YupHelper.mapRules(YupHelper.mapSchemaType(type), [
				{ ...config, errorMessage: ERROR_MESSAGE },
			]);
			expect(() => schema.validateSync(valid)).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync(invalid, { abortEarly: false })).message).toBe(
				ERROR_MESSAGE
			);
		});

		const generateConditionalSchema = (type: TYupSchemaType, is: any) =>
			Yup.object().shape({
				field1: YupHelper.mapRules(YupHelper.mapSchemaType(type), [
					{
						when: {
							field2: {
								is,
								then: [{ required: true, errorMessage: ERROR_MESSAGE }],
								otherwise: [{ min: 5, errorMessage: ERROR_MESSAGE_2 }],
							},
						},
					},
				]),
			});

		it("should support conditional validation for Yup string type", () => {
			const schema = generateConditionalSchema("string", "hello");

			expect(() => schema.validateSync({ field1: "hi", field2: "hello" })).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: "hello" })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: "hi", field2: "world" })).message).toBe(
				ERROR_MESSAGE_2
			);
		});

		it("should support conditional validation for Yup number type", () => {
			const schema = generateConditionalSchema("number", 1);

			expect(() => schema.validateSync({ field1: 5, field2: 1 })).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: 1 })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: 4, field2: 2 })).message).toBe(
				ERROR_MESSAGE_2
			);
		});

		it("should support conditional validation with config as condition for Yup string type", () => {
			const schema = generateConditionalSchema("string", [{ filled: true }, { min: 3 }]);

			expect(() => schema.validateSync({ field1: "hi", field2: "hello" })).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: "hello" })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: "hi", field2: "hi" })).message).toBe(
				ERROR_MESSAGE_2
			);
		});

		it("should support conditional validation with config as condition for Yup number type", () => {
			const schema = generateConditionalSchema("number", [{ filled: true }, { min: 3 }]);

			expect(() => schema.validateSync({ field1: 1, field2: 3 })).not.toThrowError();
			expect(TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: 3 })).message).toBe(
				ERROR_MESSAGE
			);
			expect(TestHelper.getError(() => schema.validateSync({ field1: 1, field2: 1 })).message).toBe(
				ERROR_MESSAGE_2
			);
		});

		it("should support conditional validation with config as condition for Yup array type", () => {
			const schema = generateConditionalSchema("array", [{ filled: true }, { min: 3 }]);

			expect(() => schema.validateSync({ field1: ["a"], field2: ["a", "b", "c"] })).not.toThrowError();
			expect(
				TestHelper.getError(() => schema.validateSync({ field1: undefined, field2: ["a", "b", "c"] })).message
			).toBe(ERROR_MESSAGE);
			expect(TestHelper.getError(() => schema.validateSync({ field1: ["a"], field2: ["a", "b"] })).message).toBe(
				ERROR_MESSAGE_2
			);
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
