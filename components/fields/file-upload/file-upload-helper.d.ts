import { IFile } from "./types";
export declare namespace FileUploadHelper {
    /**
     * picks an available slot
     * slot refers to the index of the file selected
     * this is for tracking so we can remove the correct file when user removes it
     * NOTE: validation for max no. of files should be carried out outside this function, this function will only look for the next available slot
     */
    const findAvailableSlot: (files: IFile[]) => number;
}
