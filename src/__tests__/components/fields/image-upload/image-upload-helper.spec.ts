import { IImage } from "../../../../components/fields/image-upload";
import { ImageUploadHelper } from "../../../../components/fields/image-upload/image-upload-helper";

describe("image-upload-helper", () => {
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
			const images = takenSlots.map((slot: number) => ({ slot } as IImage));

			expect(ImageUploadHelper.findAvailableSlot(images)).toBe(expected);
		});
	});
});
