/* eslint-disable @typescript-eslint/no-explicit-any */
import { EraserBrush } from "@erase2d/fabric";
import { useDrag, usePinch } from "@use-gesture/react";
import { Canvas as FabricCanvas, FabricImage, FabricObject, Path, PencilBrush, Point, Rect, TEvent } from "fabric";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { FileHelper, TestHelper } from "../../../../../utils";
import { Canvas, Wrapper } from "./image-editor.styles";
import { IImageEditorProps, IImageEditorRef } from "./types";
import { useWindowHelper } from "../../../../../utils/hooks";

const MAX_ZOOM = 5;
const PENCIL_BRUSH_SIZE = 10;

export const ImageEditor = forwardRef((props: IImageEditorProps, ref: ForwardedRef<IImageEditorRef>) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const { maxSizeInKb, baseImageDataURL, drawing, color, erase } = props;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricCanvas = useRef<FabricCanvas>();
	const fabricBackground = useRef<FabricImage>();
	const fittedImageBounds = useRef<{ left: number; top: number; width: number; height: number }>();
	const pencilBrush = useRef<PencilBrush>();
	const eraserBrush = useRef<EraserBrush>();
	const gestures = useRef({
		pinchStartAmount: 0,
		pan: new Point(0, 0),
	});
	const isMobileView = useWindowHelper();

	const syncCanvasDimensions = () => {
		if (!wrapperRef.current || !fabricCanvas.current) return;

		fabricCanvas.current.setDimensions({
			width: wrapperRef.current.clientWidth,
			height: wrapperRef.current.clientHeight,
		});
	};

	useImperativeHandle(ref, () => ({
		clearDrawing,
		export: () => {
			if (fabricCanvas.current) {
				resetZoomAndPosition();
				return {
					drawing: fabricCanvas.current
						.getObjects()
						.map((obj) => (obj.type !== "image" ? obj : undefined))
						.filter((obj) => obj) as FabricObject[],
					dataURL: toDataURLWithLimit(),
				};
			}

			return {
				drawing: [],
				dataURL: "",
			};
		},
	}));

	// recursively compress image until it fits limit
	const toDataURLWithLimit = (limit = maxSizeInKb, quality = 1): string => {
		if (fabricBackground.current) {
			const backgroundBounds = fabricBackground.current.getBoundingRect();
			const dataURL =
				fabricCanvas.current?.toDataURL({
					format: "jpeg",
					multiplier: (fabricBackground.current.width || 0) / backgroundBounds.width,
					quality,
					top: backgroundBounds.top,
					left: backgroundBounds.left,
					height: backgroundBounds.height,
					width: backgroundBounds.width,
				}) || "";

			const reducedQuality = quality - 0.05;
			if (reducedQuality < 0) return dataURL;

			const filesizeInB = FileHelper.getFilesizeFromBase64(dataURL);
			const maxSizeInB = limit * 1024;
			if (maxSizeInB && filesizeInB > maxSizeInB) return toDataURLWithLimit(limit, reducedQuality);

			return dataURL;
		}
		return "";
	};

	// initialise fabric and brushes
	useEffect(() => {
		let canvas: FabricCanvas;
		if (wrapperRef.current && canvasRef.current) {
			canvas = new FabricCanvas(canvasRef.current);
			fabricCanvas.current = canvas;
			syncCanvasDimensions();
			fabricCanvas.current.selection = false;
			pencilBrush.current = new PencilBrush(fabricCanvas.current);
			eraserBrush.current = new EraserBrush(fabricCanvas.current);
			fabricCanvas.current.freeDrawingBrush = pencilBrush.current;
		}

		return () => {
			if (canvas) {
				canvas.dispose();
			}
		};
	}, []);

	// when screen resizes
	useEffect(() => {
		const handleResize = async () => {
			if (wrapperRef.current && canvasRef.current && fabricCanvas.current && fabricBackground.current) {
				// slight delay because fabricjs cannot redraw in time during orientation change
				await new Promise((resolve) => setTimeout(resolve));

				resetZoomAndPosition();

				const canvasWidth = wrapperRef.current.clientWidth;
				const canvasHeight = wrapperRef.current.clientHeight;
				const oldBackgroundLeft = fabricBackground.current.left || 0;
				const oldBackgroundTop = fabricBackground.current.top || 0;

				syncCanvasDimensions();

				const backgroundBounds = fabricBackground.current.getBoundingRect();
				const scale = Math.min(canvasWidth / backgroundBounds.width, canvasHeight / backgroundBounds.height);

				fitImageToCanvas();

				const canvasObjects = fabricCanvas.current.getObjects();
				canvasObjects.forEach((obj) => {
					// only images have cacheKey
					if (!(obj as any).cacheKey) {
						obj.scaleX = (obj.scaleX || 1) * scale;
						obj.scaleY = (obj.scaleY || 1) * scale;
						obj.left =
							(fabricBackground.current?.left || 0) + ((obj.left || 0) - oldBackgroundLeft) * scale;
						obj.top = (fabricBackground.current?.top || 0) + ((obj.top || 0) - oldBackgroundTop) * scale;
					}
					obj.setCoords();
				});
			}
		};
		window.addEventListener("resize", handleResize);
		screen.orientation?.addEventListener("change", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
			screen.orientation?.removeEventListener("change", handleResize);
		};
	}, []);

	// reset back to default view
	const resetZoomAndPosition = () => {
		if (fabricCanvas.current) {
			fabricCanvas.current.setZoom(1);
			gestures.current.pinchStartAmount = 0;
			gestures.current.pan = new Point(0, 0);
			fabricCanvas.current.absolutePan(new Point(0, 0));
			fabricCanvas.current.requestRenderAll();
		}
	};

	const clampPanToImageBounds = (pan: Point, zoom = fabricCanvas.current?.getZoom() || 1) => {
		if (!fabricCanvas.current || !fabricBackground.current || zoom <= 1) return new Point(0, 0);

		const imageBounds = fittedImageBounds.current || fabricBackground.current.getBoundingRect();
		const canvasWidth = fabricCanvas.current.getWidth();
		const canvasHeight = fabricCanvas.current.getHeight();

		const clampAxis = (value: number, imageStart: number, imageSize: number, canvasSize: number) => {
			const minPan = imageStart * zoom;
			const maxPan = (imageStart + imageSize) * zoom - canvasSize;

			if (minPan >= maxPan) return (minPan + maxPan) / 2;

			return Math.min(Math.max(value, minPan), maxPan);
		};

		return new Point(
			clampAxis(pan.x, imageBounds.left, imageBounds.width, canvasWidth),
			clampAxis(pan.y, imageBounds.top, imageBounds.height, canvasHeight)
		);
	};

	const applyPan = (pan: Point, zoom?: number) => {
		if (!fabricCanvas.current) return;

		gestures.current.pan = clampPanToImageBounds(pan, zoom);
		fabricCanvas.current.absolutePan(gestures.current.pan);
	};

	// =============================================================================
	// PHOTO AND DRAWINGS
	// =============================================================================
	const clearDrawing = () => {
		if (fabricCanvas.current) {
			fabricCanvas.current.getObjects().forEach((obj) => {
				if (!obj.isType("image")) fabricCanvas.current?.remove(obj);
			});
		}
	};

	const fitImageToCanvas = () => {
		if (fabricCanvas.current && fabricBackground.current) {
			const img = fabricBackground.current;
			const canvasRatio = fabricCanvas.current.getWidth() / fabricCanvas.current.getHeight();
			const imgRatio = (img.width || 1) / (img.height || 1);
			if (imgRatio <= canvasRatio) {
				img.scaleToHeight(fabricCanvas.current?.getHeight() || 1);
			} else {
				img.scaleToWidth(fabricCanvas.current?.getWidth() || 1);
			}
			fabricCanvas.current.centerObject(img);

			// extra logic to zoom in to fit image to canvas width in mobile landscape orientation

			if (isMobileView() && canvasRatio > 1) {
				const intendedZoom = Math.min((fabricCanvas.current.width || 0) / img.getScaledWidth() + 0.1, MAX_ZOOM);
				fabricCanvas.current.zoomToPoint(
					new Point((fabricCanvas.current.width || 0) / 2, (fabricCanvas.current.height || 0) / 2),
					intendedZoom
				);
			}

			fabricCanvas.current.clipPath = new Rect({
				left: img.left,
				top: img.top,
				width: img.getScaledWidth(),
				height: img.getScaledHeight(),
			});

			if (pencilBrush.current && eraserBrush.current) {
				pencilBrush.current.width = PENCIL_BRUSH_SIZE * (img.scaleX || 1);
				eraserBrush.current.width = PENCIL_BRUSH_SIZE * (img.scaleX || 1) * 2;
			}

			img.setCoords(); // Ensures the internal coordinate system matches the visual state after scaling
			fittedImageBounds.current = img.getBoundingRect();
			fabricCanvas.current.requestRenderAll();
		}
	};

	// update image
	useEffect(() => {
		const handleUpdateImage = async () => {
			if (baseImageDataURL) {
				const img = await FabricImage.fromURL(baseImageDataURL);
				if (fabricCanvas.current) {
					syncCanvasDimensions();
					if (fabricBackground.current) {
						fabricCanvas.current.remove(fabricBackground.current);
					}
					img.selectable = false;
					img.hoverCursor = "default";
					img.erasable = false;
					fabricCanvas.current.insertAt(0, img); // Insert the image as the lowest object so we can draw on top of it
					fabricBackground.current = img;
					resetZoomAndPosition();
					fitImageToCanvas();
				}
			}
		};
		handleUpdateImage();
	}, [baseImageDataURL]);

	// update drawing
	useEffect(() => {
		if (fabricCanvas.current) {
			fabricCanvas.current.getObjects().forEach((obj) => {
				if (obj.type !== "image") {
					fabricCanvas.current.remove(obj);
				}
			});
			drawing?.forEach((d: Path) => {
				fabricCanvas.current.add(d);
			});
			fabricCanvas.current.requestRenderAll();
		}
	}, [drawing]);

	// =============================================================================
	// DRAWING MODES
	// =============================================================================
	// toggle drawing mode
	// fires when user clicks draw or save
	useEffect(() => {
		if (fabricCanvas.current) {
			if (color || erase) {
				fabricCanvas.current.isDrawingMode = true;
			} else if (fabricCanvas.current.isDrawingMode) {
				fabricCanvas.current.isDrawingMode = false;
				resetZoomAndPosition();
			}
		}
	}, [color, erase]);

	useEffect(() => {
		if (pencilBrush.current && color) {
			pencilBrush.current.color = color;
		}
	}, [color]);

	useEffect(() => {
		if (fabricCanvas.current) {
			if (erase) {
				fabricCanvas.current.freeDrawingBrush = eraserBrush.current;
			} else if (pencilBrush.current) {
				fabricCanvas.current.freeDrawingBrush = pencilBrush.current;
			}
		}
	}, [erase]);

	// =============================================================================
	// GESTURES
	// =============================================================================
	const handleMouseDown = (e: TEvent) => {
		if (typeof TouchEvent !== "undefined" && e.e instanceof TouchEvent && e.e.touches.length === 2) {
			if (typeof TouchEvent !== "undefined" && fabricCanvas.current && fabricCanvas.current.isDrawingMode) {
				fabricCanvas.current.isDrawingMode = false;

				// prevent drawing when gesturing
				// clear accidental drawings while gesturing
				try {
					(fabricCanvas.current.freeDrawingBrush as any).onMouseUp({ e: {} });
				} catch (e) {}
				const canvasObjects = fabricCanvas.current.getObjects();
				if (canvasObjects.length > 1) {
					fabricCanvas.current.remove(canvasObjects[canvasObjects.length - 1]);
				}
			}
		}
	};

	const handleMouseUp = (e: TEvent) => {
		if (typeof TouchEvent !== "undefined" && e.e instanceof TouchEvent && e.e.touches.length === 0) {
			gestures.current.pinchStartAmount = 0;
			if (fabricCanvas.current && (color || erase)) {
				fabricCanvas.current.isDrawingMode = true;
			}
		}

		fabricCanvas.current?.getObjects().forEach((obj) => {
			obj.selectable = false;
			obj.hoverCursor = "default";
		});
	};

	const handlePencilErasable = (e: any) => {
		const path = e.path as Path;
		path.erasable = true; // Important for @erase2d/fabric
	};

	useEffect(() => {
		if (fabricCanvas.current) {
			fabricCanvas.current.on("mouse:down", handleMouseDown);
			fabricCanvas.current.on("mouse:up", handleMouseUp);
			fabricCanvas.current.on("path:created", handlePencilErasable);
		}

		return () => {
			if (fabricCanvas.current) {
				fabricCanvas.current.off("mouse:down", handleMouseDown);
				fabricCanvas.current.off("mouse:up", handleMouseUp);
				fabricCanvas.current.off("path:created", handlePencilErasable);
			}
		};
	}, [fabricCanvas.current, color, erase]);

	usePinch(
		({ offset, origin, touches }) => {
			if (color || erase) {
				if (fabricCanvas.current && touches === 2) {
					if (gestures.current.pinchStartAmount === 0) {
						gestures.current.pinchStartAmount = fabricCanvas.current.getZoom();
					} else {
						const scale = offset[0];
						let zoom = gestures.current.pinchStartAmount * scale;
						if (zoom < 1) zoom = 1;
						else if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
						const oldZoom = fabricCanvas.current.getZoom();
						const [ox, oy] = origin;
						const nextPan = new Point(
							((gestures.current.pan.x + ox) / oldZoom) * zoom - ox,
							((gestures.current.pan.y + oy) / oldZoom) * zoom - oy
						);

						fabricCanvas.current.setZoom(zoom);
						applyPan(nextPan, zoom);
					}
				}
			}
		},
		{ target: wrapperRef, pointer: { touch: true } }
	);

	useDrag(
		({ delta: [dx, dy], touches }) => {
			if (color || erase) {
				if (fabricCanvas.current && touches === 2) {
					applyPan(new Point(gestures.current.pan.x - dx, gestures.current.pan.y - dy));
				}
			}
		},
		{ target: wrapperRef, pointer: { touch: true } }
	);

	return (
		<Wrapper ref={wrapperRef}>
			<Canvas id={TestHelper.generateId("imageEditor")} ref={canvasRef} canDraw={!!(color || erase)} />
		</Wrapper>
	);
});
