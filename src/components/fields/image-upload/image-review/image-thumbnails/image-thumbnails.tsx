import { BaseTheme, Color } from "@lifesg/react-design-system";
import { PlusIcon } from "@lifesg/react-icons";
import { ChangeEvent, useRef } from "react";
import { useTheme } from "styled-components";
import { TestHelper } from "../../../../../utils";
import { EImageStatus, IImage, ISharedImageProps, TFileCapture } from "../../types";
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

const ADD_PLACEHOLDER_ICON = "https://assets.life.gov.sg/web-frontend-engine/img/icons/photo-placeholder-add.svg";
const WARNING_ICON = "https://assets.life.gov.sg/web-frontend-engine/img/icons/warning-grey.svg";

interface IProps extends Omit<ISharedImageProps, "maxSizeInKb"> {
	activeFileIndex: number;
	capture?: TFileCapture;
	images: IImage[];
	onClickThumbnail: (index: number) => void;
	onSelectFile: (files: File[]) => void;
	multiple?: boolean | undefined;
}

export const ImageThumbnails = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		accepts,
		activeFileIndex,
		capture,
		id = "image-thumbnails",
		images,
		maxFiles,
		onClickThumbnail,
		onSelectFile,
		multiple,
	} = props;
	const fileInputRef = useRef<HTMLInputElement>(null);
	const theme = useTheme();

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files?.length > 0) {
			onSelectFile(Array.from(event.target.files));
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
			} else if (image.status > EImageStatus.NONE || image.status === EImageStatus.ERROR_CUSTOM_MUTED) {
				return (
					<ThumbnailItem
						key={index}
						id={TestHelper.generateId(id, `item-${index + 1}`)}
						data-testid={TestHelper.generateId(id, `item-${index + 1}`)}
						src={image.thumbnailDataURL || image.dataURL || ADD_PLACEHOLDER_ICON}
						type="button"
						aria-label={`thumbnail of ${image.name}`}
						onClick={() => onClickThumbnail(index)}
					>
						<BorderOverlay isSelected={activeFileIndex === index} />
					</ThumbnailItem>
				);
			} else if (image.addedFrom === "reviewModal" || image.status < EImageStatus.NONE) {
				return (
					<ThumbnailItem
						key={index}
						id={TestHelper.generateId(id, `item-${index + 1}`)}
						data-testid={TestHelper.generateId(id, `item-${index + 1}`)}
						type="button"
						aria-label={`error with ${image.name}`}
						onClick={() => onClickThumbnail(index)}
						error
					>
						<BorderOverlay isSelected={activeFileIndex === index} />
						<ThumbnailWarningIcon src={WARNING_ICON} />
					</ThumbnailItem>
				);
			}
		});

	// render only when no. of added images is less than max count or if max count is zero
	const renderAddButton = () =>
		(images.filter(
			({ status, addedFrom }) =>
				status >= EImageStatus.NONE || status === EImageStatus.ERROR_CUSTOM_MUTED || addedFrom === "reviewModal"
		).length < maxFiles ||
			!maxFiles) && (
			<>
				<HiddenFileSelect
					id={TestHelper.generateId(id, "file-input")}
					data-testid={TestHelper.generateId(id, "file-input")}
					type="file"
					aria-hidden="true"
					tabIndex={-1}
					capture={capture}
					ref={fileInputRef}
					accept={accepts.map((fileType) => `.${fileType}`).join(", ")}
					onChange={handleInputChange}
					multiple={multiple}
					value="" // controlling the value to allow for the same file to be uploaded (by triggering on change)
				/>
				<AddImageButton
					type="button"
					id={TestHelper.generateId(id, "add-image-button")}
					data-testid={TestHelper.generateId(id, "add-image-button")}
					aria-label="add image"
					onClick={handleButtonClick}
					borderColor={Color.Primary({ theme: theme || BaseTheme })}
				>
					<PlusIcon />
				</AddImageButton>
			</>
		);

	return (
		<ThumbnailsWrapper id={TestHelper.generateId(id)}>
			{renderThumbnails()}
			{renderAddButton()}
		</ThumbnailsWrapper>
	);
};
