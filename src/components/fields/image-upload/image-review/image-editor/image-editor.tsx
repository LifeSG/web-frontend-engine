/* eslint-disable @typescript-eslint/no-explicit-any */
import { fabric } from "fabric";
import { ForwardedRef, forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import { FileHelper, TestHelper, WindowHelper } from "../../../../../utils";
import { Canvas, Wrapper } from "./image-editor.styles";
import { IImageEditorProps, IImageEditorRef } from "./types";

const MAX_ZOOM = 5;
const PENCIL_BRUSH_SIZE = 10;

export const ImageEditor = forwardRef((props: IImageEditorProps, ref: ForwardedRef<IImageEditorRef>) => {
	//  =============================================================================
	// CONST, STATE, REFS
	//  =============================================================================
	const { maxSizeInB, baseImageDataURL, drawing, color, erase, clear } = props;
	const wrapperRef = useRef<HTMLDivElement>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const fabricCanvas = useRef<fabric.Canvas>();
	const fabricBackground = useRef<fabric.Image>();
	const pencilBrush = useRef<fabric.PencilBrush>();
	const eraserBrush = useRef<fabric.BaseBrush>();
	const gestures = useRef({
		pinchStartAmount: 0,
		panAmount: { x: 0, y: 0 },
	});

	useImperativeHandle(ref, () => ({
		export() {
			if (fabricCanvas.current) {
				resetZoomAndPosition();
				return {
					drawing: fabricCanvas.current
						.getObjects()
						.map((obj) => (obj.type !== "image" ? obj : undefined))
						.filter((obj) => obj) as fabric.Object[],
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
	const toDataURLWithLimit = (limit = maxSizeInB, quality = 1): string => {
		if (fabricBackground.current) {
			const dataURL =
				fabricCanvas.current?.toDataURL({
					format: "jpeg",
					multiplier: (fabricBackground.current.width || 0) / fabricBackground.current.getScaledWidth(),
					quality,
					top: fabricBackground.current.top,
					left: fabricBackground.current.left,
					height: fabricBackground.current.getScaledHeight(),
					width: fabricBackground.current.getScaledWidth(),
				}) || "";
			const filesize = FileHelper.getFilesizeFromBase64(dataURL);

			if (limit && filesize > limit) return toDataURLWithLimit(limit, quality - 0.05);
			return dataURL;
		}
		return "";
	};

	// initialise fabric and brushes
	useEffect(() => {
		if (wrapperRef.current && canvasRef.current) {
			canvasRef.current.width = wrapperRef.current?.clientWidth;
			canvasRef.current.height = wrapperRef.current?.clientHeight;
			fabricCanvas.current = new fabric.Canvas(TestHelper.generateId("imageEditor"));
			fabricCanvas.current.selection = false;

			pencilBrush.current = new fabric.PencilBrush(fabricCanvas.current);

			// eraser brush is an optional fabric module, the typing is not included that's why the need to use `any`
			eraserBrush.current = new (fabric as any).EraserBrush(fabricCanvas.current) as fabric.BaseBrush;

			fabricCanvas.current.freeDrawingBrush = pencilBrush.current;
		}
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

				fabricCanvas.current.setWidth(canvasWidth);
				fabricCanvas.current.setHeight(canvasHeight);

				const scale = Math.min(
					canvasWidth / fabricBackground.current.getScaledWidth(),
					canvasHeight / fabricBackground.current.getScaledHeight()
				);

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

			const vpt = fabricCanvas.current.viewportTransform || [0, 0, 0, 0, 0, 0];
			vpt[4] = 0;
			vpt[5] = 0;

			fabricCanvas.current.renderAll();
		}
	};

	// =============================================================================
	// PHOTO AND DRAWINGS
	// =============================================================================
	const fitImageToCanvas = () => {
		if (fabricCanvas.current && fabricBackground.current) {
			const img = fabricBackground.current;
			const canvasRatio = fabricCanvas.current.getWidth() / fabricCanvas.current.getHeight();
			const imgRatio = (img.width || 1) / (img.height || 1);
			if (imgRatio <= canvasRatio) {
				img.scaleToHeight(fabricCanvas.current?.getHeight() || 1);
				img.left = (fabricCanvas.current.getWidth() - img.getScaledWidth()) / 2;
				img.top = 0;
			} else {
				img.scaleToWidth(fabricCanvas.current?.getWidth() || 1);
				img.top = (fabricCanvas.current.getHeight() - img.getScaledHeight()) / 2;
				img.left = 0;
			}

			// extra logic to zoom in to fit image to canvas width in mobile landscape orientation
			if (WindowHelper.isMobileView() && canvasRatio > 1) {
				const intendedZoom = Math.min((fabricCanvas.current.width || 0) / img.getScaledWidth() + 0.1, MAX_ZOOM);
				fabricCanvas.current.zoomToPoint(
					{ x: (fabricCanvas.current.width || 0) / 2, y: (fabricCanvas.current.height || 0) / 2 },
					intendedZoom
				);
			}

			fabricCanvas.current.clipPath = new fabric.Rect({
				left: img.left,
				top: img.top,
				width: img.getScaledWidth(),
				height: img.getScaledHeight(),
			});

			if (pencilBrush.current && eraserBrush.current) {
				pencilBrush.current.width = PENCIL_BRUSH_SIZE * (img.scaleX || 1);
				eraserBrush.current.width = PENCIL_BRUSH_SIZE * (img.scaleX || 1) * 2;
			}

			fabricCanvas.current.renderAll();
		}
	};

	// update image
	useEffect(() => {
		if (baseImageDataURL) {
			fabric.Image.fromURL(baseImageDataURL, (img) => {
				if (fabricCanvas.current) {
					if (fabricBackground.current) {
						fabricCanvas.current.remove(fabricBackground.current);
					}
					img.selectable = false;
					img.hoverCursor = "default";
					(img as any).erasable = false;
					fabricCanvas.current.add(img);
					fabricBackground.current = img;

					resetZoomAndPosition();
					fitImageToCanvas();
				}
			});
		}
	}, [baseImageDataURL]);

	// update drawing
	useEffect(() => {
		setTimeout(() => {
			if (fabricCanvas.current) {
				fabricCanvas.current.getObjects().forEach((obj) => {
					if (obj.type !== "image") {
						fabricCanvas.current?.remove(obj);
					}
				});
				drawing?.forEach((d: fabric.Object) => {
					const path = new fabric.Path((d as any).path, d);
					fabricCanvas.current?.add(path);
				});
				fabricCanvas.current.renderAll();
			}
		});
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
				fabricCanvas.current.freeDrawingBrush = eraserBrush.current as fabric.BaseBrush;
			} else if (pencilBrush.current) {
				fabricCanvas.current.freeDrawingBrush = pencilBrush.current;
			}
		}
	}, [erase]);

	useEffect(() => {
		if (clear && fabricCanvas.current) {
			fabricCanvas.current.getObjects().forEach((obj) => {
				if (!obj.isType("image")) fabricCanvas.current?.remove(obj);
			});
		}
	}, [clear]);

	// =============================================================================
	// GESTURES
	// =============================================================================
	const handleMouseDown = (e: fabric.IEvent) => {
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

	const handleMouseUp = (e: fabric.IEvent) => {
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

	const handlePinch = (e: fabric.IEvent) => {
		if (typeof TouchEvent !== "undefined" && (color || erase)) {
			const innerEvent = e.e as TouchEvent;
			if (fabricCanvas.current && innerEvent.touches?.length === 2) {
				const { self } = e as any;
				if (self.state === "start" || gestures.current.pinchStartAmount === 0) {
					gestures.current.pinchStartAmount = fabricCanvas.current.getZoom();
				} else {
					let zoom = gestures.current.pinchStartAmount * self.scale;
					if (zoom < 1) zoom = 1;
					else if (zoom > MAX_ZOOM) zoom = MAX_ZOOM;
					fabricCanvas.current.zoomToPoint({ x: self.x, y: self.y }, zoom);
				}
			}
		}
	};

	const handleDrag = (e: fabric.IEvent) => {
		if (typeof TouchEvent !== "undefined" && (color || erase)) {
			const innerEvent = e.e as TouchEvent;
			if (fabricCanvas.current && innerEvent.touches?.length === 2) {
				if (innerEvent.type !== "touchstart") {
					const xChange = innerEvent.touches[0].clientX - gestures.current.panAmount.x;
					const yChange = innerEvent.touches[0].clientY - gestures.current.panAmount.y;
					fabricCanvas.current.relativePan({ x: xChange, y: yChange });

					const vpt = fabricCanvas.current.viewportTransform || [];
					const zoom = fabricCanvas.current.getZoom();
					if (vpt[4] >= 0) {
						vpt[4] = 0;
					} else if (vpt[4] < -fabricCanvas.current.getWidth() * (zoom - 1)) {
						vpt[4] = -fabricCanvas.current.getWidth() * (zoom - 1);
					}
					if (vpt[5] >= 0) {
						vpt[5] = 0;
					} else if (vpt[5] < -fabricCanvas.current.getHeight() * (zoom - 1)) {
						vpt[5] = -fabricCanvas.current.getHeight() * (zoom - 1);
					}
				}
				gestures.current.panAmount = { x: innerEvent.touches[0].clientX, y: innerEvent.touches[0].clientY };
			}
		}
	};

	useEffect(() => {
		if (fabricCanvas.current) {
			fabricCanvas.current
				.on("mouse:down", handleMouseDown)
				.on("mouse:up", handleMouseUp)
				.on("touch:gesture", handlePinch)
				.on("touch:drag", handleDrag);
		}

		return () => {
			if (fabricCanvas.current) {
				fabricCanvas.current
					.off("mouse:down", handleMouseDown)
					.off("mouse:up", handleMouseUp)
					.off("touch:gesture", handlePinch)
					.off("touch:drag", handleDrag);
			}
		};
	}, [fabricCanvas.current, color, erase]);

	return (
		<Wrapper ref={wrapperRef}>
			<Canvas id={TestHelper.generateId("imageEditor")} ref={canvasRef} canDraw={!!(color || erase)} />
		</Wrapper>
	);
});
