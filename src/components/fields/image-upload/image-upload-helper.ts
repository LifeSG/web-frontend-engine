import { IImage } from "./types";

export namespace ImageUploadHelper {
	/**
	 * picks an available slot
	 * slot refers to the index of the file selected
	 * this is for tracking so we can remove the correct file when user removes it
	 * if maxFiles is not provided, assign based on no. of files / previous highest slot
	 */
	export const findAvailableSlot = (maxFiles: number, files: IImage[]) => {
		const highestSlot = files.reduce((accumulator, { slot }) => (slot > accumulator ? slot : accumulator), 0);
		const maxSlots = Math.max(maxFiles, highestSlot, files.length);
		const possibleSlots = Array(maxSlots)
			.fill(0)
			.map((foo, i) => i);
		const takenSlots = files.map(({ slot }) => slot);
		const openSlots = possibleSlots.filter((possibleSlot) => !takenSlots.includes(possibleSlot));
		return openSlots[0];
	};
}
