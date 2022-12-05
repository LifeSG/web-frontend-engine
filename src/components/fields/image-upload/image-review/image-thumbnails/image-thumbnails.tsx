import { ChangeEvent, useRef } from "react";
import AddPlaceholderIcon from "../../../../../assets/img/icons/photo-placeholder-add.svg";
import WarningIcon from "../../../../../assets/img/icons/warning-grey.svg";
import { TestHelper } from "../../../../../utils";
import { EImageStatus, IImage, TImageUploadAcceptedFileType } from "../../types";
import {
	AddImageButton,
	BorderOverlay,
	HiddenFileSelect,
	LoadingBox,
	LoadingDot,
	ThumbnailItem,
	ThumbnailWarningIcon,
	ThumbnailsWrapper,
} from "./image-thumbnails.styles";

interface IProps {
	id?: string;
	activeFileIndex: number;
	images: IImage[];
	accepts: TImageUploadAcceptedFileType[];
	maxFiles: number;
	onClickThumbnail: (index: number) => void;
	onSelectFile: (file: File) => void;
}

export const ImageThumbnails = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		activeFileIndex,
		images,
		accepts,
		id = "image-thumbnails",
		maxFiles,
		onClickThumbnail,
		onSelectFile,
	} = props;
	const fileInputRef = useRef<HTMLInputElement>(null);

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files) {
			onSelectFile(event.target.files[0]);
		}
	};

	const handleButtonClick = () => fileInputRef?.current?.click();

	//  =============================================================================
	// RENDER FUNCTIONS
	//  =============================================================================
	const renderThumbnails = () =>
		images.map((image, index) => {
			if (image.status === EImageStatus.NONE) {
				return (
					<LoadingBox key={index}>
						{[...Array(4)].map((_x, index) => (
							<LoadingDot key={`dot-${index}`} />
						))}
					</LoadingBox>
				);
			} else if (image.status > EImageStatus.NONE) {
				return (
					<ThumbnailItem
						key={index}
						id={TestHelper.generateId(id, `item-${index + 1}`)}
						data-testid={TestHelper.generateId(id, `item-${index + 1}`)}
						src={image.thumbnailDataURL || image.dataURL || AddPlaceholderIcon}
						onClick={() => onClickThumbnail(index)}
					>
						<BorderOverlay isSelected={activeFileIndex === index} />
					</ThumbnailItem>
				);
			} else if (image.addedFrom === "reviewModal") {
				return (
					<ThumbnailItem
						key={index}
						id={TestHelper.generateId(id, `item-${index + 1}`)}
						data-testid={TestHelper.generateId(id, `item-${index + 1}`)}
						onClick={() => onClickThumbnail(index)}
						error
					>
						<BorderOverlay isSelected={activeFileIndex === index} />
						<ThumbnailWarningIcon src={WarningIcon} />
					</ThumbnailItem>
				);
			}
		});

	// render only when no. of added images is less than max count or if max count is zero
	const renderAddButton = () =>
		images.filter(({ status, addedFrom }) => status >= EImageStatus.NONE || addedFrom === "reviewModal").length <
			maxFiles ||
		(!maxFiles && (
			<>
				<HiddenFileSelect
					id={TestHelper.generateId(id, "file-input")}
					data-testid={TestHelper.generateId(id, "file-input")}
					type="file"
					ref={fileInputRef}
					accept={accepts.join(", ")}
					onChange={handleInputChange}
				/>
				<AddImageButton
					type="button"
					id={TestHelper.generateId(id, "add-image-button")}
					data-testid={TestHelper.generateId(id, "add-image-button")}
					onClick={handleButtonClick}
				>
					<img alt="add" src={AddPlaceholderIcon} />
				</AddImageButton>
			</>
		));

	return (
		<ThumbnailsWrapper id={TestHelper.generateId(id)}>
			{renderThumbnails()}
			{renderAddButton()}
		</ThumbnailsWrapper>
	);
};
