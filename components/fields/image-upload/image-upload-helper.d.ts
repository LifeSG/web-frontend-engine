import { IImage } from "./types";
export declare namespace ImageUploadHelper {
    /** Render when base64 is ready, or when FileItem should show a validation/upload error row. */
    const shouldRenderFileItem: (image: IImage) => boolean;
    /**
     * picks an available slot
     * slot refers to the index of the file selected
     * this is for tracking so we can remove the correct file when user removes it
     * NOTE: validation for max no. of images should be carried out outside this function, this function will only look for the next available slot
     */
    const findAvailableSlot: (images: IImage[]) => number;
}
