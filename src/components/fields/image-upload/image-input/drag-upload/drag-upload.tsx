import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { FileHelper, TestHelper } from "../../../../../utils";
import { HiddenInput, HintContainer, HintText, Wrapper } from "./drag-upload.styles";
import { IDragUploadProps, IDragUploadRef } from "./types";

const UPLOAD_ICON = "https://assets.life.gov.sg/web-frontend-engine/img/icons/global-upload.svg";

export const DragUpload = forwardRef<IDragUploadRef, IDragUploadProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { accept, capture, children, hint = "Drop photos here", id = "drag-upload", onInput, multiple } = props;
	const hiddenInputRef = useRef<HTMLInputElement>();
	const { getRootProps, isDragActive } = useDropzone({ onDrop: onInput, noClick: true });

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		if (!files.length) return;

		setTimeout(() => {
			onInput(files);
		}, 100); // 100ms delay to ensure files are available
	};

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	useImperativeHandle<IDragUploadRef, IDragUploadRef>(ref, () => ({
		fileDialog: () => hiddenInputRef.current?.click(),
	}));

	// =============================================================================
	// RENDER FUNCTIONS
	// =============================================================================
	const renderHint = () => {
		return (
			<HintContainer id={TestHelper.generateId(id, "hint")} data-testid={TestHelper.generateId(id, "hint")}>
				<img src={UPLOAD_ICON} alt="" />
				<HintText weight="semibold">{hint}</HintText>
			</HintContainer>
		);
	};

	return (
		<Wrapper id={TestHelper.generateId(id)} data-testid={TestHelper.generateId(id)} {...getRootProps()}>
			<HiddenInput
				id={TestHelper.generateId(id, "hidden-input")}
				data-testid={TestHelper.generateId(id, "hidden-input")}
				ref={hiddenInputRef}
				type="file"
				aria-hidden="true"
				tabIndex={-1}
				capture={capture}
				/* accept needs to be full MIME types (e.g., image/jpeg).
				Otherwise, the camera on some Android devices will not open when the capture attribute is set.
				See more here: https://stackoverflow.com/questions/77876374 */
				accept={accept?.map((type) => FileHelper.fileExtensionToMimeType(type)).join(",")}
				onChange={handleInputChange}
				onClick={(event) => {
					(event.target as HTMLInputElement).value = "";
				}}
				multiple={multiple}
			/>
			{children}
			{isDragActive ? renderHint() : null}
		</Wrapper>
	);
});
