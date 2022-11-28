import { IImage } from "./types";

export namespace ImageUploadHelper {
	/**
	 * picks an available slot
	 * slot refers to the index of the file selected
	 * this is for tracking so we can remove the correct file when user removes it
	 */
	export const findAvailableSlot = (maxFiles: number, files: IImage[]) => {
		const possibleSlots = Array(maxFiles)
			.fill(0)
			.map((foo, i) => i);
		const takenSlots = files.map(({ slot }) => slot);
		const openSlots = possibleSlots.filter((possibleSlot) => !takenSlots.includes(possibleSlot));
		return openSlots[0];
	};
}
