import { ChangeEvent, forwardRef, useImperativeHandle, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { TestHelper } from "../../../utils";
import { HiddenInput, HintContainer, HintText, Wrapper } from "./drag-upload.styles";
import { IDragUploadProps, IDragUploadRef } from "./types";

const UPLOAD_ICON = "https://assets.life.gov.sg/web-frontend-engine/img/icons/global-upload.svg";

export const DragUpload = forwardRef<IDragUploadRef, IDragUploadProps>((props, ref) => {
	// =============================================================================
	// CONST, STATE, REFS
	// =============================================================================
	const { accept, capture, children, hint = "Drop photos here", id = "drag-upload", onInput } = props;
	const hiddenInputRef = useRef<HTMLInputElement>();
	const { getRootProps, isDragActive } = useDropzone({ onDrop: onInput, noClick: true });

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			onInput(Array.from(event.target.files));
		}
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
				accept={accept?.map((type) => `image/${type}`).join(",")}
				onChange={handleInputChange}
				onClick={(event) => {
					(event.target as HTMLInputElement).value = "";
				}}
			/>
			{children}
			{isDragActive ? renderHint() : null}
		</Wrapper>
	);
});
