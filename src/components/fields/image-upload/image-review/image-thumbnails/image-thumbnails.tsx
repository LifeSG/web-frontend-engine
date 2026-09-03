import { Border, Colour, Radius } from "@lifesg/react-design-system/theme";
import { useApplyStyle } from "@lifesg/react-design-system/theme";
import { Button } from "@lifesg/react-design-system/button";
import { DashedBorder } from "@lifesg/react-design-system/dashed-border";
import { ExclamationTriangleIcon } from "@lifesg/react-icons/exclamation-triangle";
import { PlusIcon } from "@lifesg/react-icons/plus";
import clsx from "clsx";
import { ChangeEvent, useRef } from "react";
import { TestHelper } from "../../../../../utils";
import { EImageStatus, IImage, ISharedImageProps, TFileCapture } from "../../types";
import * as styles from "./image-thumbnails.styles";

const ADD_PLACEHOLDER_ICON = "https://assets.life.gov.sg/web-frontend-engine/img/icons/photo-placeholder-add.svg";

// =============================================================================
// THUMBNAIL WITH IMAGE
// =============================================================================
interface IThumbnailWithImageProps {
	id: string;
	src: string;
	isSelected: boolean;
	isError?: boolean;
	ariaLabel: string;
	onClick: () => void;
}

const ThumbnailWithImage = ({ id, src, isSelected, isError, ariaLabel, onClick }: IThumbnailWithImageProps) => {
	const thumbnailRef = useRef<HTMLButtonElement>(null);

	useApplyStyle(thumbnailRef, {
		[styles.tokens.thumbnailItem.backgroundImage]: src ? `url(${src})` : undefined,
	});

	return (
		<button
			ref={thumbnailRef}
			id={id}
			data-testid={id}
			type="button"
			aria-label={ariaLabel}
			className={clsx(styles.thumbnailItem, isError && styles.thumbnailItemError)}
			onClick={onClick}
		>
			<div className={clsx(styles.borderOverlay, isSelected && styles.borderOverlayIsSelected)} />
			{isError && <ExclamationTriangleIcon className={styles.thumbnailWarningIcon} />}
		</button>
	);
};

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

	// =============================================================================
	// EVENT HANDLERS
	// =============================================================================
	const handleInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
		const files = Array.from(event.target.files || []);
		if (!files.length) return;

		setTimeout(() => {
			onSelectFile(files);
		}, 100); // 100ms delay to ensure files are available
	};

	const handleButtonClick = () => fileInputRef?.current?.click();

	//  =============================================================================
	// RENDER FUNCTIONS
	//  =============================================================================
	const renderThumbnails = () =>
		images.map((image, index) => {
			if (image.status === EImageStatus.NONE) {
				return (
					<div className={styles.loadingBox} key={index}>
						{[...Array(4)].map((_x, index) => (
							<div className={styles.loadingDot} key={`dot-${index}`} />
						))}
					</div>
				);
			} else if (image.status > EImageStatus.NONE || image.status === EImageStatus.ERROR_CUSTOM_MUTED) {
				return (
					<ThumbnailWithImage
						key={index}
						id={TestHelper.generateId(id, `item-${index + 1}`)}
						src={image.thumbnailDataURL || image.dataURL || ADD_PLACEHOLDER_ICON}
						isSelected={activeFileIndex === index}
						ariaLabel={`thumbnail of ${image.name}`}
						onClick={() => onClickThumbnail(index)}
					/>
				);
			} else if (image.addedFrom === "reviewModal" || image.status < EImageStatus.NONE) {
				return (
					<ThumbnailWithImage
						key={index}
						id={TestHelper.generateId(id, `item-${index + 1}`)}
						src=""
						isSelected={activeFileIndex === index}
						isError
						ariaLabel={`error with ${image.name}`}
						onClick={() => onClickThumbnail(index)}
					/>
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
				<input
					className={styles.hiddenFileSelect}
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
				<DashedBorder
					className={styles.addImageButtonWrapper}
					colour={Colour["border-primary"]}
					radius={Radius.sm}
					thickness={Border["width-040"]}
				>
					<Button
						className={styles.addImageButton}
						type="button"
						id={TestHelper.generateId(id, "add-image-button")}
						data-testid={TestHelper.generateId(id, "add-image-button")}
						aria-label="add image"
						styleType="secondary"
						onClick={handleButtonClick}
						icon={<PlusIcon />}
					/>
				</DashedBorder>
			</>
		);

	return (
		<div className={styles.thumbnailsWrapper} id={TestHelper.generateId(id)}>
			{renderThumbnails()}
			{renderAddButton()}
		</div>
	);
};
