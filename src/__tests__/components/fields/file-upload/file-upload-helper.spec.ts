import { IFile } from "../../../../components/fields";
import { FileUploadHelper } from "../../../../components/fields/file-upload/file-upload-helper";

describe("file-upload-helper", () => {
	describe("findAvailableSlot", () => {
		it.each`
			scenario                    | takenSlots   | expected
			${"no slots taken"}         | ${[]}        | ${0}
			${"slot 0 is taken"}        | ${[0]}       | ${1}
			${"slot 1 is taken"}        | ${[1]}       | ${0}
			${"slot 0, 1 are taken"}    | ${[0, 1]}    | ${2}
			${"slot 0, 2 are taken"}    | ${[0, 2]}    | ${1}
			${"slot 1, 2 are taken"}    | ${[1, 2]}    | ${0}
			${"slot 0, 1, 2 are taken"} | ${[0, 1, 2]} | ${3}
		`("should return slot $expected if $scenario", ({ takenSlots, expected }) => {
			const files = takenSlots.map((slot: number) => ({ slot } as IFile));

			expect(FileUploadHelper.findAvailableSlot(files)).toBe(expected);
		});
	});
});
