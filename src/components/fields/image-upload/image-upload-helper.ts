import { IImage } from "./types";

export namespace ImageUploadHelper {
	/**
	 * picks an available slot
	 * slot refers to the index of the file selected
	 * this is for tracking so we can remove the correct file when user removes it
	 * NOTE: validation for max no. of images should be carried out outside this function, this function will only look for the next available slot
	 */
	export const findAvailableSlot = (images: IImage[]) => {
		const highestSlot = images.reduce((accumulator, { slot }) => (slot > accumulator ? slot : accumulator), 0);
		const maxSlots = Math.max(highestSlot, images.length);

		const possibleSlots = Array(maxSlots)
			.fill(0)
			.map((foo, i) => i);
		const takenSlots = images.map(({ slot }) => slot);
		const openSlots = possibleSlots.filter((possibleSlot) => !takenSlots.includes(possibleSlot));
		return openSlots[0] ?? maxSlots;
	};
}
