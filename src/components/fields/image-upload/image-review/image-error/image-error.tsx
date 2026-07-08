import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Button } from "@lifesg/react-design-system/button";
import { Typography } from "@lifesg/react-design-system/typography";
import { FileHelper, TestHelper } from "../../../../../utils";
import { ERROR_MESSAGES } from "../../../../shared";
import { ImageContext } from "../../image-context";
import { EImageStatus, IImage, ISharedImageProps } from "../../types";
import * as styles from "./image-error.styles";
import { Breakpoint, useMediaQuery, useResolvedBreakpointToken } from "@lifesg/react-design-system/theme";

const WARNING_ICON = "https://assets.life.gov.sg/web-frontend-engine/img/icons/warning-white.svg";

interface IProps extends Omit<ISharedImageProps, "maxFiles"> {
	image: IImage;
	onClickOk: (e: React.MouseEvent<HTMLButtonElement>) => void;
	maxFilesErrorMessage?: string | undefined;
	maxFiles?: number | undefined;
}

export const ImageError = (props: IProps) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const {
		id = "photo-error",
		image: { name, status, customErrorMessage },
		accepts,
		maxSizeInKb,
		onClickOk,
		maxFilesErrorMessage,
		maxFiles,
	} = props;
	const { images } = useContext(ImageContext);
	const [errorTitle, setErrorTitle] = useState<string>();
	const [errorDescription, setErrorDescription] = useState<JSX.Element>();
	const [transformedFileName, setTransformedFileName] = useState<string>();
	const errorDescriptionRef = useRef<HTMLParagraphElement>(null);
	const smMaxToken = useResolvedBreakpointToken(Breakpoint["sm-max"]);

	const isMobileLandscape = useMediaQuery({
		clauses: [
			{ feature: "orientation", value: "landscape" },
			{ feature: "max-height", value: smMaxToken },
		],
	});

	// =============================================================================
	// HELPER FUNCTIONS
	// =============================================================================
	const setFileNameToWidth = useCallback(() => {
		const transformed = FileHelper.truncateFileName(name, errorDescriptionRef);
		setTransformedFileName(transformed);
	}, [name]);

	//  =============================================================================
	// EFFECTS
	//  =============================================================================
	useEffect(() => {
		const filename = <span className={styles.nameWrapper}>{transformedFileName}</span>;

		switch (status) {
			case EImageStatus.ERROR_FORMAT:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("photo").MODAL.FILE_TYPE.TITLE);
				setErrorDescription(ERROR_MESSAGES.UPLOAD("photo").MODAL.FILE_TYPE.DESCRIPTION(filename, accepts));
				break;
			case EImageStatus.ERROR_FILENAME:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("file").MODAL.GENERIC_ERROR.INVALID_FILE_NAME);
				setErrorDescription(<>{customErrorMessage}</>);
				break;
			case EImageStatus.ERROR_GENERIC:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("photo").MODAL.GENERIC_ERROR.TITLE);
				setErrorDescription(ERROR_MESSAGES.UPLOAD("photo").MODAL.GENERIC_ERROR.DESCRIPTION(filename));
				break;
			case EImageStatus.ERROR_SIZE:
				setErrorTitle(ERROR_MESSAGES.UPLOAD("photo").MODAL.MAX_FILE_SIZE.TITLE);
				setErrorDescription(
					ERROR_MESSAGES.UPLOAD("photo").MODAL.MAX_FILE_SIZE.DESCRIPTION(filename, maxSizeInKb)
				);
				break;

			case EImageStatus.ERROR_EXCEED: {
				const remainingPhotos = maxFiles - images.filter(({ status }) => status >= EImageStatus.NONE).length;
				let errorMessage = maxFilesErrorMessage;
				if (!errorMessage) {
					if (remainingPhotos < 1 || images.length === 0) {
						errorMessage = ERROR_MESSAGES.UPLOAD("photo").MAX_FILES(maxFiles);
					} else {
						errorMessage = ERROR_MESSAGES.UPLOAD("photo").MAX_FILES_WITH_REMAINING(remainingPhotos);
					}
				}
				setErrorTitle("Photo limit exceeded");
				setErrorDescription(<>{errorMessage}</>);
				break;
			}
		}
	}, [
		accepts,
		customErrorMessage,
		images,
		maxFiles,
		maxFilesErrorMessage,
		maxSizeInKb,
		name,
		status,
		transformedFileName,
	]);

	useEffect(() => {
		const handleResize = () => {
			if (errorDescriptionRef.current) {
				setFileNameToWidth();
			}
		};

		const resizeObserver = new ResizeObserver(handleResize);
		const currentElement = errorDescriptionRef.current;

		if (currentElement) {
			resizeObserver.observe(currentElement);
			setFileNameToWidth();
		}

		return () => {
			if (currentElement) {
				resizeObserver.unobserve(currentElement);
			}
		};
	}, [errorDescriptionRef, setFileNameToWidth]);

	//  =============================================================================
	// RENDER FUNCTIONS
	//  =============================================================================
	return (
		<div className={styles.wrapper} data-mobile-landscape={!!isMobileLandscape}>
			<img className={styles.errorIcon} src={WARNING_ICON} alt={errorTitle} />
			<div className={styles.content}>
				<Typography.HeadingXS
					className={styles.titleText}
					id={TestHelper.generateId(id, "title")}
					data-testid={TestHelper.generateId(id, "title")}
					weight="bold"
				>
					{errorTitle}
				</Typography.HeadingXS>
				<Typography.BodyBL className={styles.bodyText} ref={errorDescriptionRef}>
					{errorDescription}
				</Typography.BodyBL>
				<Button
					className={styles.okButton}
					onClick={onClickOk}
					id={TestHelper.generateId(id, "ok-button")}
					data-testid={TestHelper.generateId(id, "ok-button")}
				>
					OK
				</Button>
			</div>
		</div>
	);
};
