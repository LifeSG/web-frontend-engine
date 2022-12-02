import { TestHelper } from "../../../../../utils";
import { Prompt } from "../../../../shared";
import { IImage } from "../../types";

interface IProps {
	onDecideClearDrawing: (decision?: boolean) => void;
	onDecideDelete: (decision: boolean) => void;
	onDecideExit: (decision?: boolean) => void;
	id?: string;
	images: IImage[];
	show?: "delete" | "exit" | "clear-drawing";
}

export const ImagePrompts = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const { id = "image-prompts", onDecideClearDrawing, onDecideDelete, onDecideExit, images, show } = props;

	//  =============================================================================
	// RENDER FUNCTIONS
	//  =============================================================================
	return (
		<>
			<Prompt
				id={TestHelper.generateId(id, "delete")}
				title={images.length > 1 ? "Delete photo?" : "Delete photo and exit?"}
				show={show === "delete"}
				size="large"
				description={
					images.length > 1
						? "This photo will not be uploaded."
						: "As you're deleting the only photo, you'll be brought back to the form. You'll have to upload another photo."
				}
				buttons={[
					{
						id: "delete",
						title: images.length > 1 ? "Yes, delete" : "Delete and exit",
						onClick: () => onDecideDelete(true),
					},
					{
						id: "cancel",
						title: "Cancel",
						buttonStyle: "secondary",
						onClick: () => onDecideDelete(false),
					},
				]}
			/>
			<Prompt
				id={TestHelper.generateId(id, "exit")}
				title="Exit without saving?"
				show={show === "exit"}
				description="Your photos or drawings will not be saved."
				buttons={[
					{
						id: "exit",
						title: "Yes, exit",
						onClick: () => onDecideExit(true),
					},
					{
						id: "cancel",
						title: "Cancel",
						buttonStyle: "secondary",
						onClick: () => onDecideExit(false),
					},
				]}
			/>
			<Prompt
				id={TestHelper.generateId(id, "clearing-drawing")}
				title="Clear drawings?"
				show={show === "clear-drawing"}
				description="Your changes will not be saved."
				buttons={[
					{
						title: "Yes, clear",
						onClick: () => onDecideClearDrawing(true),
					},
					{
						title: "Cancel",
						buttonStyle: "secondary",
						onClick: () => onDecideClearDrawing(false),
					},
				]}
			/>
		</>
	);
};
